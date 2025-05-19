import logging
from io import BytesIO
from typing import List, Optional
from PIL import Image

from services.image_processor import ImageProcessor
from services.db_service import DBService
from services.s3_service import S3Service
from models.photo_dto import PhotoItem, PhotoProcessingResult

logger = logging.getLogger(__name__)

class PhotoProcessor:
    """사진 처리 프로세서 - 사용자가 등록한 이미지에서 옷만 추출"""

    def __init__(self):
        self.image_processor = ImageProcessor()
        self.db_service = DBService()
        self.s3_service = S3Service()

    async def process_photo(
            self,
            member_id: int,
            items: List[PhotoItem],
            message_id: Optional[str] = None,
    ) -> List[PhotoProcessingResult]:
        """사진 처리 및 DB 업데이트"""
        results = []

        # message_id는 실제로 task_id로 사용됨 - 디버깅 로그 추가
        logger.info(f"Processing photos with task_id: {message_id}")

        for item in items:
            try:
                logger.info(f"Processing photo: closetClothesId={item.closetClothesId}, category={item.categoryId}")

                # 카테고리 이름 조회 - 수정된 부분
                if item.categoryId == -1:
                    # -1은 기본값으로 상의(1) 처리
                    category_id = 1  # 상의 카테고리 ID
                    category_name = "상의"
                    logger.info(f"카테고리 ID가 -1이어서 기본값 '상의'로 설정합니다")
                else:
                    category_id = item.categoryId
                    category_name = self.db_service.get_category_name(category_id) or "상의"

                logger.info(f"카테고리 이름: {category_name}")

                # 1. S3 URL에서 이미지 다운로드
                img_buffer = await self._download(item.s3Url)
                if not img_buffer:
                    logger.error(f"이미지 다운로드 실패: {item.s3Url}")
                    results.append(self._create_error_result(member_id, item.closetClothesId, item.categoryId, message_id))
                    continue

                # 2. 항상 GPT로 이미지 생성
                processed_buffer = None
                try:
                    # 이미지 열기
                    img_buffer.seek(0)
                    pil_img = Image.open(img_buffer).convert("RGB")

                    # 중요: 사람 감지 로직 완전히 우회하고 무조건 GPT 사용
                    logger.info(f"무조건 GPT로 이미지 생성을 시작합니다 (카테고리: {category_name})")

                    # 기존 _has_person 함수는 무시하고 바로 _generate_with_reference 호출
                    processed_buffer = self.image_processor._generate_with_reference(category_name, pil_img)

                    # GPT 생성 확인 로그
                    if processed_buffer:
                        logger.info("GPT 이미지 생성 성공!")
                    else:
                        logger.error("GPT 이미지 생성 실패, 폴백으로 배경 제거 시도")
                        img_buffer.seek(0)
                        processed_buffer = self.image_processor.remove_background(img_buffer)

                except Exception as e:
                    logger.error(f"GPT 이미지 생성 실패: {e}")
                    # 폴백: 배경 제거 시도
                    try:
                        logger.info("폴백으로 배경 제거 시도")
                        img_buffer.seek(0)
                        processed_buffer = self.image_processor.remove_background(img_buffer)
                    except Exception as e2:
                        logger.error(f"배경 제거도 실패: {e2}")
                        results.append(self._create_error_result(member_id, item.closetClothesId, item.categoryId, message_id))
                        continue

                if not processed_buffer:
                    logger.error("이미지 처리 결과가 없습니다 (GPT도 실패, 배경 제거도 실패)")
                    results.append(self._create_error_result(member_id, item.closetClothesId, item.categoryId, message_id))
                    continue

                # 3. S3에 업로드
                processed_buffer.seek(0)
                s3_uri = self.s3_service.upload_image(processed_buffer, category_id, 1)  # 색상 ID는 임의로 1 사용
                if not s3_uri:
                    logger.error("S3 업로드 실패")
                    results.append(self._create_error_result(member_id, item.closetClothesId, item.categoryId, message_id))
                    continue

                # 4. DB 업데이트 (closet_clothes 테이블)
                if not self._update_closet_clothes(item.closetClothesId, s3_uri):
                    logger.error(f"DB 업데이트 실패: ID={item.closetClothesId}")
                    results.append(self._create_error_result(member_id, item.closetClothesId, item.categoryId, message_id))
                    continue

                # 성공 결과 추가
                results.append(PhotoProcessingResult(
                    memberId=member_id,
                    closetClothesId=item.closetClothesId,
                    category_id=category_id,
                    image_url=s3_uri,
                    processing_status="SUCCESS",
                    message_id=message_id  # task_id로 사용
                ))
                logger.info(f"✓ Photo processing completed for closetClothesId {item.closetClothesId}")

            except Exception as e:
                logger.error(f"× Photo processing error for closetClothesId {item.closetClothesId}: {e}")
                results.append(self._create_error_result(member_id, item.closetClothesId, item.categoryId, message_id))

        return results

    async def _download(self, url: str) -> BytesIO:
        """URL에서 이미지 다운로드"""
        try:
            from services.product_processor import ProductProcessor
            processor = ProductProcessor()
            return await processor._download(url)
        except Exception as e:
            logger.error(f"다운로드 오류 {url}: {e}")
            return None

    def _update_closet_clothes(self, closet_clothes_id: int, image_url: str) -> bool:
        """closet_clothes 테이블 업데이트"""
        try:
            # DB 연결
            import pymysql
            from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

            conn = pymysql.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                db=DB_NAME,
                port=DB_PORT,
                charset='utf8mb4'
            )

            cursor = conn.cursor()

            # closet_clothes 테이블 업데이트
            sql = "UPDATE closet_clothes SET image_url = %s WHERE id = %s"
            affected_rows = cursor.execute(sql, (image_url, closet_clothes_id))
            conn.commit()

            cursor.close()
            conn.close()

            return affected_rows > 0
        except Exception as e:
            logger.error(f"DB 업데이트 오류: {e}")
            return False

    def _create_error_result(self, member_id: int, closet_clothes_id: int, category_id: int, message_id: Optional[str]) -> PhotoProcessingResult:
        """에러 결과 생성"""
        return PhotoProcessingResult(
            memberId=member_id,
            closetClothesId=closet_clothes_id,
            category_id=category_id,
            image_url="",
            processing_status="ERROR",
            message_id=message_id  # task_id로 사용
        )