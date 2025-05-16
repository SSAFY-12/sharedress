import asyncio
import logging
import os
from typing import Dict, List, Tuple, Optional, Any
from io import BytesIO
import requests
from PIL import Image
from sqlalchemy import text

from models.db_models import Clothes, Category, get_db
from services.image_processor import ImageProcessor
from services.color_extractor import ColorExtractor
from services.s3_service import S3Service

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("image_processor.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ImageReprocessor:
    def __init__(self):
        """이미지 재처리기 초기화"""
        self.db = next(get_db())
        self.image_processor = ImageProcessor()
        self.color_extractor = ColorExtractor()
        self.s3_service = S3Service()

        # 이미지가 포함된 상품 정보 캐시
        self.products_with_images = self._load_products_with_images()

        # 처리 결과 통계
        self.stats = {
            "total": 0,
            "success": 0,
            "no_person": 0,
            "has_person": 0,
            "failed": 0,
            "skipped": 0
        }

    def _load_products_with_images(self) -> List[Tuple[int, str, int, int]]:
        """DB에서 'image'가 포함된 image_url을 가진 상품 정보 로드"""
        try:
            # image_url에 'image'가 포함된 상품 조회
            query = text("""
                SELECT id, image_url, category_id, color_id 
                FROM clothes 
                WHERE image_url LIKE '%image%'
            """)
            result = self.db.execute(query)

            # 결과를 리스트로 변환 (id, image_url, category_id, color_id)
            products = [(row[0], row[1], row[2], row[3]) for row in result]
            logger.info(f"DB에서 'image'가 포함된 image_url을 가진 {len(products)}개 상품 로드 완료")
            return products
        except Exception as e:
            logger.error(f"상품 정보 로드 중 오류: {e}")
            return []

    async def process_all_images(self, batch_size: int = 10):
        """모든 이미지 처리"""
        try:
            if not self.products_with_images:
                logger.warning("처리할 이미지가 없습니다.")
                return

            total_count = len(self.products_with_images)
            self.stats["total"] = total_count
            logger.info(f"시작: 총 {total_count}개 이미지 처리")

            # 배치 처리
            for i in range(0, total_count, batch_size):
                batch = self.products_with_images[i:i+batch_size]
                logger.info(f"배치 처리 중: {i+1}~{i+len(batch)}/{total_count} (배치 크기: {len(batch)})")

                # 각 상품 병렬 처리
                tasks = [self.process_image(product) for product in batch]
                await asyncio.gather(*tasks)

                # 중간 진행 상황 로깅
                processed = i + len(batch)
                logger.info(f"진행 상황: {processed}/{total_count} ({processed/total_count*100:.1f}%)")
                logger.info(f"사람 없음: {self.stats['no_person']}, 사람 있음: {self.stats['has_person']}, 성공: {self.stats['success']}, 실패: {self.stats['failed']}, 건너뜀: {self.stats['skipped']}")

                # 메모리 관리를 위해 세션 정리
                self.db.expire_all()

            logger.info(f"완료! 최종 결과: 사람 없음={self.stats['no_person']}, 사람 있음={self.stats['has_person']}, 성공={self.stats['success']}, 실패={self.stats['failed']}, 건너뜀={self.stats['skipped']}")

        except Exception as e:
            logger.error(f"전체 처리 중 오류 발생: {e}")
        finally:
            self.db.close()

    async def process_image(self, product_info: Tuple[int, str, int, int]):
        """개별 이미지 처리"""
        product_id, image_url, category_id, color_id = product_info

        try:
            # 상품 정보 로깅
            category_name = self._get_category_name(category_id)
            logger.info(f"상품 {product_id} (카테고리: {category_name}) 처리 시작: {image_url}")

            # 1. 이미지 다운로드
            try:
                image_buf, pil_img = await self._download_image(image_url)
                if not image_buf:
                    logger.warning(f"상품 {product_id}: 이미지 다운로드 실패, 건너뜀")
                    self.stats["skipped"] += 1
                    return
            except Exception as e:
                logger.error(f"상품 {product_id}: 이미지 다운로드 중 오류 - {e}")
                self.stats["failed"] += 1
                return

            # 2. 사람 여부 확인
            try:
                has_person = self.image_processor._has_person(pil_img)
                if has_person:
                    logger.info(f"상품 {product_id}: 사람이 있는 이미지, 처리 건너뜀")
                    self.stats["has_person"] += 1
                    return
                else:
                    logger.info(f"상품 {product_id}: 사람이 없는 이미지, 처리 계속")
                    self.stats["no_person"] += 1
            except Exception as e:
                logger.error(f"상품 {product_id}: 사람 여부 확인 중 오류 - {e}")
                self.stats["failed"] += 1
                return

            # 3. 누끼 처리
            try:
                processed_buf = self.image_processor.remove_background(image_buf)
                if not processed_buf:
                    logger.error(f"상품 {product_id}: 누끼 처리 실패")
                    self.stats["failed"] += 1
                    return
                logger.info(f"상품 {product_id}: 누끼 처리 성공")
            except Exception as e:
                logger.error(f"상품 {product_id}: 누끼 처리 중 오류 - {e}")
                self.stats["failed"] += 1
                return

            # 4. S3 업로드
            try:
                processed_buf.seek(0)
                s3_url = self.s3_service.upload_image(processed_buf, category_id, color_id)
                if not s3_url:
                    logger.error(f"상품 {product_id}: S3 업로드 실패")
                    self.stats["failed"] += 1
                    return
                logger.info(f"상품 {product_id}: S3 업로드 성공 - {s3_url}")
            except Exception as e:
                logger.error(f"상품 {product_id}: S3 업로드 중 오류 - {e}")
                self.stats["failed"] += 1
                return

            # 5. DB 업데이트
            try:
                # 상품 정보 업데이트 (image_url 필드만)
                update_query = text("""
                                    UPDATE clothes
                                    SET image_url = :image_url
                                    WHERE id = :id
                                    """)

                self.db.execute(update_query, {
                    "image_url": s3_url,
                    "id": product_id
                })

                self.db.commit()
                logger.info(f"상품 {product_id}: DB 업데이트 성공")
                self.stats["success"] += 1
            except Exception as e:
                self.db.rollback()
                logger.error(f"상품 {product_id}: DB 업데이트 중 오류 - {e}")
                self.stats["failed"] += 1

        except Exception as e:
            logger.error(f"상품 {product_id}: 처리 중 예상치 못한 오류 - {e}")
            self.stats["failed"] += 1

    async def _download_image(self, url: str) -> Tuple[Optional[BytesIO], Optional[Image.Image]]:
        """이미지 URL에서 이미지 다운로드"""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            buf = BytesIO(response.content)
            return buf, Image.open(buf).convert("RGB")
        except Exception as e:
            logger.error(f"이미지 다운로드 실패 ({url}): {e}")
            return None, None

    def _get_category_name(self, category_id: int) -> str:
        """카테고리 ID로 카테고리 이름 조회"""
        category_map = {1: "상의", 2: "아우터", 3: "하의", 4: "신발", 5: "악세사리"}
        return category_map.get(category_id, f"알 수 없음({category_id})")

async def main():
    """메인 함수"""
    # 배치 크기 설정
    batch_size = int(os.environ.get("BATCH_SIZE", "10"))

    processor = ImageReprocessor()
    await processor.process_all_images(batch_size)

if __name__ == "__main__":
    asyncio.run(main())