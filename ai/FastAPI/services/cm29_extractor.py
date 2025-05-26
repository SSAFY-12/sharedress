import logging, re, requests
from bs4 import BeautifulSoup
from typing import List, Optional

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────
_ALLOWED_MAP: list[tuple[re.Pattern, str]] = [
    # 상의
    (re.compile(r"(상의|티셔츠|셔츠|니트|후디|스웨트|슬리브리스|블라우스|피케|카라)", re.I), "상의"),
    # 아우터
    (re.compile(r"아우터", re.I), "아우터"),
    # 하의
    (re.compile(r"(바지|팬츠|데님|진|하의)", re.I), "하의"),
    # 원피스/스커트
    (re.compile(r"(원피스|스커트|점프수트|셋업)", re.I), "원피스/스커트"),
    # 신발
    (re.compile(r"신발", re.I), "신발"),
    # 악세사리 (가방·액세서리)
    (re.compile(r"(가방|액세서리)", re.I), "악세사리"),
]

def _map_category(candidates: List[str]) -> Optional[str]:
    """후보 문자열 리스트 → 내부 대분류 매핑"""
    for text in candidates:
        for pattern, mapped in _ALLOWED_MAP:
            if pattern.search(text):
                return mapped
    return None
# ──────────────────────────────────────────────────────────────

class CM29Extractor:
    _HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0"
        )
    }

    def extract(self, url: str) -> dict:
        r = requests.get(url, headers=self._HEADERS, timeout=10)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")

        # ① 상품명
        title_tag = soup.select_one("h2#pdp_product_name")
        if not title_tag:
            return {"error": "INVALID_PRODUCT"}
        name = title_tag.get_text(strip=True)
        if "color" in name.lower():
            logger.info("상품명에 'color' 포함 – SKIP")
            return {"error": "INVALID_PRODUCT"}

        # ② 카테고리 후보 전부 수집
        cand_tags = soup.select("span.css-96h8o6.e1w312mf1") \
                    + soup.select("a.css-1c17h3y.e1w312mf3")
        cand_texts = [t.get_text(strip=True) for t in cand_tags]
        category = _map_category(cand_texts)
        if category is None:
            logger.warning("카테고리 매칭 실패: %s", cand_texts)
            return {"error": "UNSUPPORTED_CATEGORY"}

        # ③ 대표 이미지 1장
        img_tag = soup.select_one("img.css-12qah06.e3e1mx65")
        img_url = (img_tag["src"].split("?")[0] if img_tag and img_tag.get("src") else "")
        images = [img_url] if img_url else []

        return {
            "product_name": name,
            "category_text": category,
            "image_urls": images,
        }

# 헬퍼
def get_extractor() -> CM29Extractor:
    return CM29Extractor()
