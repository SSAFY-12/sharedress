# services/product_processor.py
import logging, aiohttp
from io import BytesIO
from typing import Optional, List
from PIL import Image

from services.html_extractor  import HTMLExtractor
from services.image_processor import ImageProcessor
from services.color_extractor import ColorExtractor
from services.s3_service      import S3Service
from services.db_service      import DBService
from models.dto               import ProductProcessingResult

logger = logging.getLogger(__name__)


class ProductProcessor:
    def __init__(self):
        self.html_extractor  = HTMLExtractor()
        self.image_processor = ImageProcessor()
        self.color_extractor = ColorExtractor()
        self.s3_service      = S3Service()
        self.db_service      = DBService()

    # ───────────────────────────────────────────
    async def _download(self, url: str) -> BytesIO | None:
        try:
            async with aiohttp.ClientSession() as s:
                async with s.get(url) as r:
                    if r.status == 200:
                        return BytesIO(await r.read())
            logger.warning("다운로드 실패 %s: %s", r.status, url)
        except Exception as e:
            logger.error("다운로드 오류 %s: %s", url, e)
        return None

    # ───────────────────────────────────────────
    async def process_product(
            self,
            url: str,
            desired_color: Optional[str] = None,
            message_id: Optional[str] = None,
            clothes_id: Optional[int] = None
    ) -> ProductProcessingResult:

        try:
            html = self.html_extractor.extract_from_url(url, desired_color)

            # 유효하지 않은 상품 체크
            if "error" in html:
                if html.get("error") == "INVALID_PRODUCT":
                    logger.info(f"유효하지 않은 상품 건너뛰기: {url}")
                    return ProductProcessingResult(
                        url=url,
                        product_name="Invalid Product",
                        category_id=0,  # 0으로 설정하여 무효한 상품임을 표시
                        category_name="무효",
                        color_id=0,
                        color_name="무효",
                        color_hex="#000000",
                        image_url="",
                        processing_status="SKIPPED",  # 상태를 SKIPPED로 변경
                        message_id=message_id
                    )
                # 다른 일반적인 에러의 경우 기존 에러 처리 유지
                return self._err(url, message_id, html["error"])

            # 카테고리 확인 - 지원되는 카테고리인지 검사
            cat_txt = html.get("category_text", "상의")

            if cat_txt in ["악세사리", "악세서리","액세서리","액세사리"]:
                cat_txt = "악세사리"
            valid_categories = ["상의", "하의", "아우터", "신발", "악세사리"]

            if cat_txt not in valid_categories:
                logger.warning(f"카테고리 '{cat_txt}' 지원하지 않음. 처리 중단: {url}")
                return self._err(url, message_id, f"지원되지 않는 카테고리: {cat_txt}")

            # 1) 이미지 확보 → ImageProcessor 로 배경 제거 or 생성
            img_urls: List[str] = html.get("image_urls", [])
            buf = None
            if img_urls:
                buf = self.image_processor.process_image(img_urls, cat_txt)
            if not buf:
                buf = self.image_processor.generate_product_image(None, cat_txt)

            if not buf:
                return self._err(url, message_id, "이미지 처리 실패")

            # 2) 색상 추출
            buf.seek(0)
            pil = Image.open(buf).convert("RGB")
            color = self.color_extractor.process_image(pil, k=3)
            cid, cname, chex = color["color_id"], color["color_name"], color["color_hex"]
            logger.info("색상: %s (ID %s, HEX %s)", cname, cid, chex)

            # 3) 카테고리 → ID
            cat_map = {"상의":1,"아우터":2,"하의":3,"신발":4,"악세사리":5}
            cat_id  = cat_map.get(cat_txt, 1)

            # 4) S3 업로드
            buf.seek(0)
            uri = self.s3_service.upload_image(buf, cat_id, cid)
            if not uri:
                return self._err(url, message_id, "S3 업로드 실패")

            # 5) DB 저장 - 변경된 부분
            if clothes_id:
                # 기존 레코드 업데이트
                if not self.db_service.update_clothes_record(clothes_id, uri, cat_id, cid):
                    return self._err(url, message_id, "DB 업데이트 실패")
            else:
                # 새 레코드 생성 (기존 로직)
                if not self.db_service.create_clothes_record(uri, cat_id, cid):
                    return self._err(url, message_id, "DB 저장 실패")

            self.db_service.update_color_hex(cid, chex)

            return ProductProcessingResult(
                url=url,
                product_name=html.get("product_name", "Unknown"),
                category_id=cat_id,
                category_name=cat_txt,
                color_id=cid,
                color_name=cname,
                color_hex=chex,
                image_url=uri,
                processing_status="SUCCESS",
                message_id=message_id
            )

        except Exception as e:
            logger.error("처리 오류 %s: %s", url, e)
            return self._err(url, message_id, str(e))
        finally:
            self.db_service.close()
    # ───────────────────────────────────────────
    def _err(self, url, msg_id, msg):
        return ProductProcessingResult(
            url=url, product_name="Error",
            category_id=1, category_name="상의",
            color_id=1,  color_name="블랙 웜", color_hex="#000000",
            image_url="", processing_status="ERROR",
            message_id=msg_id
        )