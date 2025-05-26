import logging, os, re
from datetime import datetime
from io import BytesIO
from typing import Dict, List, Set

from bs4 import BeautifulSoup

from services.html_extractor import HTMLExtractor  # 29CM 상품 전용 파서 포함
from services.image_processor import ImageProcessor
from services.s3_service import S3Service
from models.db_models import get_db
from sqlalchemy import text

# ──────────────────────────────────────────────────────────────
# 고정 값 설정
# ──────────────────────────────────────────────────────────────
BRAND_ID_FIXED:        int = 1473
SHOPPING_MALL_ID_FIXED:int = 3
TYPE_FIXED:            int = 1
COLOR_ID_FIXED:        int = -1       # 초기(미정)
AI_PROCESS_STATUS:     int = 0

PAGE_DIR   = os.path.dirname(os.path.abspath(__file__))  # pageN.html 저장 경로
TOTAL_PAGES: int = 3

# 카테고리 매핑 (텍스트 → DB ID)
CATEGORY_MAP: Dict[str, int] = {
    "상의": 1,
    "아우터": 2,
    "하의": 3,
    "여성신발": 4, "남성신발": 4, "신발": 4,
    "여성가방": 5, "남성가방": 5,
    "남성액세서리": 5, "여성액세서리": 5, "악세사리": 5,
    "원피스": 6, "스커트": 6, "원피스/스커트": 6,
}

# ──────────────────────────────────────────────────────────────
# 로깅 기본 설정
# ──────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────
# 1단계: 브랜드 페이지(off-line)에서 **상품 URL만** 수집
# ──────────────────────────────────────────────────────────────

def collect_product_links(html_text: str) -> List[str]:
    """pageN.html → [goods_link ...] (중복 제거)"""
    soup = BeautifulSoup(html_text, "html.parser")
    links: Set[str] = set()
    for a in soup.select('a[href^="https://product.29cm.co.kr/catalog/"]'):
        href = a.get("href", "").split("?")[0]
        if href:
            links.add(href)
    return list(links)

# ──────────────────────────────────────────────────────────────
# 2단계: 메인 가져오기 클래스
# ──────────────────────────────────────────────────────────────

class BrandImporter:
    def __init__(self):
        self.extractor = HTMLExtractor()
        self.processor = ImageProcessor()
        self.s3        = S3Service()
        self.db        = next(get_db())
        self.stats = {"total": 0, "inserted": 0, "skipped": 0, "failed": 0}

    # DB INSERT ------------------------------------------------
    def _insert_db(self, *, category_id: int, goods_link: str, img_url: str, name: str):
        sql = text("""
                   INSERT INTO clothes (
                       type, brand_id, category_id, color_id,
                       created_at, updated_at, shopping_mall_id,
                       goods_link_url, image_url, name, ai_process_status
                   ) VALUES (
                                :type, :brand_id, :category_id, :color_id,
                                :created_at, :updated_at, :mall_id,
                                :goods_link, :image_url, :name, :status)
                   """)
        now = datetime.utcnow()
        self.db.execute(sql, {
            "type": TYPE_FIXED,
            "brand_id": BRAND_ID_FIXED,
            "category_id": category_id,
            "color_id": COLOR_ID_FIXED,
            "created_at": now,
            "updated_at": now,
            "mall_id": SHOPPING_MALL_ID_FIXED,
            "goods_link": goods_link,
            "image_url": img_url,
            "name": name,
            "status": AI_PROCESS_STATUS,
        })
        self.db.commit()

    # 페이지 순회 ----------------------------------------------
    def import_pages(self):
        for page_idx in range(1, TOTAL_PAGES + 1):
            path = os.path.join(PAGE_DIR, f"page{page_idx}.html")
            if not os.path.exists(path):
                logger.warning("%s 없음 – 건너뜀", path)
                continue
            logger.info("Parsing %s", path)
            with open(path, "r", encoding="utf-8") as fp:
                links = collect_product_links(fp.read())
            logger.info("▶ page%02d: %d개 URL", page_idx, len(links))
            for link in links:
                self._process_link(link)
        logger.info("=== 완료 === %s", self.stats)

    # 상품 1개 처리 -------------------------------------------
    def _process_link(self, goods_link: str):
        self.stats["total"] += 1

        # 1) 상품 상세 파싱
        prod = self.extractor.extract_from_url(goods_link)
        if "error" in prod:
            logger.info("[SKIP] %s → %s", prod["error"], goods_link)
            self.stats["skipped"] += 1
            return

        name = prod.get("product_name", "")
        if "color" in name.lower():
            logger.info("[SKIP] 'color' 포함 → %s", name)
            self.stats["skipped"] += 1
            return

        cat_txt = prod.get("category_text", "")
        category_id = CATEGORY_MAP.get(cat_txt)
        if not category_id:
            logger.info("[SKIP] 지원 안 되는 카테고리 %s", cat_txt)
            self.stats["skipped"] += 1
            return

        img_urls: List[str] = prod.get("image_urls", [])
        if not img_urls:
            logger.warning("[FAIL] 이미지 없음 → %s", goods_link)
            self.stats["failed"] += 1
            return

        main_img_url = img_urls[0]

        # 2) 사람 감지 & 누끼
        try:
            buf, pil = self.processor._download(main_img_url)
            if self.processor._has_person(pil):
                logger.info("[SKIP] 사람 감지 → %s", goods_link)
                self.stats["skipped"] += 1
                return
            clean_buf = self.processor.remove_background(buf)
            clean_buf.seek(0)
        except Exception as e:
            logger.error("[FAIL] 이미지 처리 오류: %s", e)
            self.stats["failed"] += 1
            return

        # 3) S3 업로드
        try:
            s3_url = self.s3.upload_image(clean_buf, category_id, COLOR_ID_FIXED)
            if not s3_url:
                raise RuntimeError("S3 업로드 실패")
        except Exception as e:
            logger.error("[FAIL] S3 업로드 오류: %s", e)
            self.stats["failed"] += 1
            return

        # 4) DB INSERT
        try:
            self._insert_db(category_id=category_id, goods_link=goods_link,
                            img_url=s3_url, name=name)
            self.stats["inserted"] += 1
            logger.info("[INSERT] %s", name)
        except Exception as e:
            logger.error("[FAIL] DB INSERT 오류: %s", e)
            self.stats["failed"] += 1

# ──────────────────────────────────────────────────────────────
# 실행 엔트리포인트
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    BrandImporter().import_pages()