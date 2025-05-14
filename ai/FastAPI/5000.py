import asyncio
import logging
import os
from typing import Dict, List, Optional, Any
from io import BytesIO
from PIL import Image
import pandas as pd
from sqlalchemy import text

from models.db_models import Clothes, get_db
from services.html_extractor import HTMLExtractor
from services.image_processor import ImageProcessor
from services.color_extractor import ColorExtractor
from services.s3_service import S3Service

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("update_products.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ProductUpdater:
    def __init__(self):
        """상품 업데이터 초기화"""
        self.db = next(get_db())
        self.html_extractor = HTMLExtractor()
        self.image_processor = ImageProcessor()
        self.color_extractor = ColorExtractor()
        self.s3_service = S3Service()

        # URL 캐시 (DB에서 직접 가져온 URL 정보)
        self.product_urls = self._load_product_urls()

        # 처리 결과 통계
        self.stats = {
            "total": 0,
            "success": 0,
            "failed": 0,
            "skipped": 0
        }

    def _load_product_urls(self) -> Dict[int, str]:
        """DB에서 상품 URL 직접 로드"""
        try:
            # 직접 SQL 쿼리로 URL 정보 가져오기
            query = text("SELECT id, goods_link_url FROM clothes WHERE id <= 13952 AND goods_link_url IS NOT NULL")
            result = self.db.execute(query)

            # ID를 키로, URL을 값으로 하는 딕셔너리 생성
            urls = {row[0]: row[1] for row in result}
            logger.info(f"DB에서 {len(urls)}개 상품 URL 로드 완료")
            return urls
        except Exception as e:
            logger.error(f"상품 URL 로드 중 오류: {e}")
            return {}

    async def update_all_products(self, start_id: int = 1, end_id: int = 13952, batch_size: int = 10):
        """ID 범위 내의 모든 상품 업데이트"""
        try:
            # URL 캐시에 기반한 업데이트 대상 확인
            products_with_url = [pid for pid in range(start_id, end_id + 1) if pid in self.product_urls]

            if not products_with_url:
                logger.warning(f"URL이 있는 상품을 찾을 수 없습니다. 업데이트 중단.")
                return

            total_count = len(products_with_url)
            self.stats["total"] = total_count
            logger.info(f"시작: URL이 있는 총 {total_count}개 상품 업데이트")

            # 배치 처리
            for i in range(0, total_count, batch_size):
                batch_ids = products_with_url[i:i+batch_size]
                logger.info(f"배치 처리 중: {batch_ids[0]}~{batch_ids[-1]} (배치 크기: {len(batch_ids)})")

                # 각 상품 병렬 처리
                tasks = [self.update_product(pid) for pid in batch_ids]
                await asyncio.gather(*tasks)

                # 중간 진행 상황 로깅
                processed = i + len(batch_ids)
                logger.info(f"진행 상황: {processed}/{total_count} ({processed/total_count*100:.1f}%)")
                logger.info(f"성공: {self.stats['success']}, 실패: {self.stats['failed']}, 건너뜀: {self.stats['skipped']}")

                # 메모리 관리를 위해 세션 정리
                self.db.expire_all()

            logger.info(f"완료! 최종 결과: 성공={self.stats['success']}, 실패={self.stats['failed']}, 건너뜀={self.stats['skipped']}")

        except Exception as e:
            logger.error(f"전체 처리 중 오류 발생: {e}")
        finally:
            self.db.close()

    async def update_product(self, product_id: int):
        """개별 상품 업데이트"""
        try:
            # URL 가져오기
            url = self.product_urls.get(product_id)

            if not url:
                logger.warning(f"상품 {product_id}: URL 없음, 건너뜀")
                self.stats["skipped"] += 1
                return

            # 상품 객체 가져오기
            product = self.db.query(Clothes).filter(Clothes.id == product_id).first()

            if not product:
                logger.warning(f"상품 {product_id}: DB에서 찾을 수 없음, 건너뜀")
                self.stats["skipped"] += 1
                return

            logger.info(f"상품 {product_id} 처리 시작: {url}")

            # 1. HTML 추출 (카테고리 및 이미지 URL)
            try:
                html_result = self.html_extractor.extract_from_url(url)
                if "error" in html_result:
                    logger.error(f"상품 {product_id}: HTML 추출 실패 - {html_result['error']}")
                    self.stats["failed"] += 1
                    return

                # 카테고리 검증
                category_text = html_result.get("category_text", "상의")
                category_map = {"상의": 1, "아우터": 2, "하의": 3, "신발": 4, "액세서리": 5}
                category_id = category_map.get(category_text, product.category_id)

                # 이미지 URL 확인
                image_urls = html_result.get("image_urls", [])
                if not image_urls:
                    logger.warning(f"상품 {product_id}: 이미지 URL을 찾을 수 없음")
                    self.stats["failed"] += 1
                    return

                logger.info(f"상품 {product_id}: {len(image_urls)}개 이미지 URL 추출됨")

            except Exception as e:
                logger.error(f"상품 {product_id}: HTML 추출 중 오류 - {e}")
                self.stats["failed"] += 1
                return

            # 2. 이미지 처리
            try:
                processed_buf = self.image_processor.process_image(image_urls, category_text)
                if not processed_buf:
                    logger.warning(f"상품 {product_id}: 이미지 처리 실패, 이미지 생성 시도")
                    processed_buf = self.image_processor.generate_product_image(None, category_text)

                if not processed_buf:
                    logger.error(f"상품 {product_id}: 이미지 처리와 생성 모두 실패")
                    self.stats["failed"] += 1
                    return

                # PIL 이미지로 변환 (색상 추출용)
                processed_buf.seek(0)
                pil_img = Image.open(processed_buf).convert("RGB")

            except Exception as e:
                logger.error(f"상품 {product_id}: 이미지 처리 중 오류 - {e}")
                self.stats["failed"] += 1
                return

            # 3. 색상 추출
            try:
                color_info = self.color_extractor.process_image(pil_img, k=3)
                color_id = color_info["color_id"]
                color_name = color_info["color_name"]
                color_hex = color_info["color_hex"]
                logger.info(f"상품 {product_id}: 색상 추출 성공 - {color_name} (ID: {color_id}, HEX: {color_hex})")

            except Exception as e:
                logger.error(f"상품 {product_id}: 색상 추출 중 오류 - {e}")
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
                # 상품 정보 업데이트 (직접 SQL 사용)
                update_query = text("""
                                    UPDATE clothes
                                    SET category_id = :category_id,
                                        color_id = :color_id,
                                        image_url = :image_url
                                    WHERE id = :id
                                    """)

                self.db.execute(update_query, {
                    "category_id": category_id,
                    "color_id": color_id,
                    "image_url": s3_url,
                    "id": product_id
                })

                # 색상 HEX 업데이트
                self.update_color_hex(color_id, color_hex)

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

    def update_color_hex(self, color_id: int, hex_code: str) -> bool:
        """색상 HEX 코드 업데이트"""
        try:
            # 직접 SQL 사용
            update_query = text("""
                                UPDATE color
                                SET color_hex = :hex_code
                                WHERE id = :color_id
                                """)

            self.db.execute(update_query, {
                "hex_code": hex_code,
                "color_id": color_id
            })

            return True
        except Exception as e:
            logger.error(f"색상 HEX 업데이트 실패 (ID: {color_id}): {e}")
            return False

async def main():
    """메인 함수"""
    # 업데이트 범위 설정
    start_id = int(os.environ.get("START_ID", "5490"))
    end_id = int(os.environ.get("END_ID", "6000"))
    batch_size = int(os.environ.get("BATCH_SIZE", "20"))

    updater = ProductUpdater()
    await updater.update_all_products(start_id, end_id, batch_size)

if __name__ == "__main__":
    asyncio.run(main())