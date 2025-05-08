import requests
from bs4 import BeautifulSoup
import logging
import os
import pickle
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


class HTMLExtractor:
    """훈련된 카테고리 추출 모델을 활용한 HTML 정보 추출기"""

    def __init__(self):
        self.MODELS_DIR = "app/models/scrapers"
        self._load_extractors()

    def _load_extractors(self):
        """학습된 추출기 로드"""
        category_path = os.path.join(self.MODELS_DIR, "category_extractor.pkl")
        if os.path.exists(category_path):
            try:
                with open(category_path, "rb") as f:
                    self.category_extractor = pickle.load(f)
                logger.info("카테고리 추출기 로드 성공")
            except Exception as e:
                logger.error(f"카테고리 추출기 로드 실패: {e}")
                self.category_extractor = None
        else:
            logger.warning("카테고리 추출기 파일이 없습니다. 직접 파싱 로직을 사용합니다.")
            self.category_extractor = None

    def extract_from_url(
            self, url: str, desired_color: Optional[str] = None
    ) -> Dict[str, Any]:
        """URL에서 상품 정보 추출"""
        try:
            headers = {
                'User-Agent': (
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                    'AppleWebKit/537.36 (KHTML, like Gecko) '
                    'Chrome/91.0.4472.124 Safari/537.36'
                )
            }
            resp = requests.get(url, headers=headers)
            resp.raise_for_status()
            html = resp.text
            soup = BeautifulSoup(html, 'html.parser')

            result: Dict[str, Any] = {}

            # 1) 카테고리 추출
            result['category_text'] = self._extract_category(soup)

            # 2) 이미지 URL 추출
            result['image_urls'] = self._extract_image_urls(url, soup, desired_color)

            return result

        except Exception as e:
            logger.error(f"URL {url}에서 정보 추출 실패: {e}")
            return {"error": str(e)}

    def _extract_category(self, soup: BeautifulSoup) -> str:
        """카테고리 정보 추출 (학습된 모델 우선, 실패 시 직접 파싱)"""

        # 1) 학습된 추출기 사용
        if self.category_extractor:
            try:
                cat = self.category_extractor.extract_category(soup)
                logger.info(f"학습기 사용 카테고리: {cat}")
                return cat
            except Exception as e:
                logger.warning(f"학습기 카테고리 추출 실패: {e}")

        # 2) 직접 파싱 (무신사 기준)
        mapping = {
            # 상의
            "티셔츠": "상의", "맨투맨": "상의", "후드": "상의", "셔츠": "상의", "니트": "상의",
            "스웨트셔츠": "상의", "카디건": "상의", "탑": "상의", "블라우스": "상의",
            "베스트": "상의", "폴로": "상의",
            # 아우터
            "자켓": "아우터", "코트": "아우터", "점퍼": "아우터", "패딩": "아우터",
            "무스탕": "아우터", "블레이저": "아우터", "짚업": "아우터",
            "재킷": "아우터", "윈드브레이커": "아우터",
            # 하의
            "바지": "하의", "청바지": "하의", "팬츠": "하의", "슬랙스": "하의",
            "데님": "하의", "레깅스": "하의", "스커트": "하의", "조거팬츠": "하의",
            "스웨트팬츠": "하의", "쇼츠": "하의", "진": "하의",
            # 신발
            "스니커즈": "신발", "구두": "신발", "로퍼": "신발", "샌들": "신발",
            "부츠": "신발", "힐": "신발", "슬리퍼": "신발", "슈즈": "신발",
            # 액세서리
            "가방": "액세서리", "모자": "액세서리", "양말": "액세서리",
            "쥬얼리": "액세서리", "벨트": "액세서리", "안경": "액세서리",
            "시계": "액세서리", "스카프": "액세서리", "넥타이": "액세서리",
            "키링": "액세서리", "머플러": "액세서리", "장갑": "액세서리",
            "패션소품": "액세서리"
        }
        mains = ["상의", "아우터", "하의", "신발", "액세서리"]

        # a) data-category-name 기반
        elems = soup.select('a[data-category-name]')
        for el in elems:
            name = el.get('data-category-name', '').strip()
            if name in mains:
                return name
            if name in mapping:
                return mapping[name]

        # b) 브레드크럼 또는 클래스 기반
        paths = soup.select(
            '.product_info_section .item_categories a, '
            'a.sc-1prswe3-0[data-category-name], '
            '.sc-1prswe3-1 a'
        )
        for p in paths:
            t = p.text.strip()
            if t in mains:
                return t
            if t in mapping:
                return mapping[t]

        # c) 메타 keywords
        mk = soup.find('meta', {'name': 'keywords'})
        if mk and mk.get('content'):
            for kw in mk['content'].split(','):
                w = kw.strip()
                if w in mains:
                    return w
                if w in mapping:
                    return mapping[w]

        logger.warning("카테고리 미발견, 기본 '상의' 반환")
        return "상의"

    def _extract_image_urls(
            self, url: str, soup: BeautifulSoup, desired_color: Optional[str]
    ) -> List[str]:
        """상품 이미지 URL 추출"""
        urls: List[str] = []

        try:
            imgs = soup.select(
                '#detail_thumbs img, #bigimg img, .product-img img, '
                '.product_thumb img, .detail_product_img img'
            )
            for img in imgs:
                src = img.get('src') or img.get('data-src') or img.get('data-original')
                if not src:
                    continue
                # 썸네일 제외
                if 'thumbnail' in src or '_30.jpg' in src:
                    continue
                # 큰 이미지 버전으로 치환
                src = src.replace('_60.jpg', '.jpg').replace('_80.jpg', '.jpg')
                # 절대경로 보정
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    base = '/'.join(url.split('/')[:3])
                    src = base + src
                if not src.lower().endswith('.gif') and 'icon' not in src.lower():
                    urls.append(src)

            # 대체: OpenGraph
            if not urls:
                og = soup.select_one('meta[property="og:image"]')
                if og and og.get('content'):
                    urls.append(og['content'])

            # (원하는 컬러 필터링 로직은 여기에 추가)

        except Exception as e:
            logger.error(f"이미지 추출 중 오류: {e}")

        return urls
