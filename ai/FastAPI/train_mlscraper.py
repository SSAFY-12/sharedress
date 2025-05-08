import requests
import os
import pickle
import json
import re
import logging
from bs4 import BeautifulSoup

# 저장 경로 설정
MODELS_DIR = "app/models/scrapers"
os.makedirs(MODELS_DIR, exist_ok=True)

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class MusinsaCategoryExtractor:
    """무신사 사이트 카테고리 추출기"""

    def __init__(self):
        self.headers = {
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/91.0.4472.124 Safari/537.36'
            )
        }

        # 세부 카테고리 → 대분류 매핑
        self.category_mapping = {
            # 상의
            "티셔츠": "상의", "맨투맨": "상의", "후드": "상의",
            "셔츠": "상의", "니트": "상의", "스웨트셔츠": "상의",
            "카디건": "상의", "탑": "상의", "블라우스": "상의",
            "베스트": "상의", "폴로": "상의",
            # 아우터
            "자켓": "아우터", "코트": "아우터", "점퍼": "아우터",
            "패딩": "아우터", "무스탕": "아우터", "블레이저": "아우터",
            "가디건": "아우터", "짚업": "아우터", "재킷": "아우터",
            "윈드브레이커": "아우터",
            # 하의
            "바지": "하의", "청바지": "하의", "팬츠": "하의",
            "슬랙스": "하의", "데님": "하의", "레깅스": "하의",
            "스커트": "하의", "조거팬츠": "하의", "스웨트팬츠": "하의",
            "쇼츠": "하의", "진": "하의",
            # 신발
            "스니커즈": "신발", "구두": "신발", "로퍼": "신발",
            "샌들": "신발", "부츠": "신발", "힐": "신발",
            "슬리퍼": "신발", "슈즈": "신발",
            # 액세서리
            "가방": "액세서리", "모자": "액세서리", "양말": "액세서리",
            "쥬얼리": "액세서리", "벨트": "액세서리", "안경": "액세서리",
            "시계": "액세서리", "스카프": "액세서리", "넥타이": "액세서리",
            "키링": "액세서리", "머플러": "액세서리", "장갑": "액세서리",
            "패션소품": "액세서리"
        }

        # 대분류 이름 목록
        self.main_categories = ["상의", "아우터", "하의", "신발", "액세서리"]

    def get_html_content(self, url: str) -> str:
        """URL에서 HTML 콘텐츠 가져오기"""
        try:
            resp = requests.get(url, headers=self.headers)
            resp.raise_for_status()
            return resp.text
        except Exception as e:
            logger.error(f"Error fetching URL {url}: {e}")
            return None

    def extract_category(self, soup: BeautifulSoup) -> str:
        """
        Extracts and normalizes the main category name from a Musinsa product page.
        1) JSON in __NEXT_DATA__
        2) window.__MSS__.product.state
        3) HTML meta tag
        4) Normalize via category_mapping / default to '상의'
        """
        category = None

        # 1. __NEXT_DATA__ JSON 파싱
        script_tag = soup.find('script', {'id': '__NEXT_DATA__'})
        if script_tag and script_tag.string:
            try:
                data = json.loads(script_tag.string)
                page_props = data.get('props', {}).get('pageProps', {})
                goods_data = None
                if page_props.get('meta', {}).get('data'):
                    goods_data = page_props['meta']['data']
                elif page_props.get('initialState') and isinstance(page_props['initialState'], dict):
                    goods_data = page_props['initialState']
                if goods_data:
                    cat_info = goods_data.get('category', {})
                    main_cat = cat_info.get('categoryDepth1Name')
                    if main_cat:
                        category = main_cat
                    else:
                        full = goods_data.get('baseCategoryFullPath', '')
                        if full:
                            category = full.split('>')[0].strip()
            except Exception:
                category = None

        # 2. window.__MSS__.product.state JSON 파싱
        if not category:
            for script in soup.find_all('script'):
                txt = script.get_text() or ""
                if 'window.__MSS__.product.state' in txt:
                    start = txt.find('{', txt.find('window.__MSS__.product.state'))
                    end = txt.find('};', start)
                    if 0 <= start < end:
                        try:
                            obj = json.loads(txt[start:end+1])
                            main_cat = obj.get('category', {}).get('categoryDepth1Name')
                            if main_cat:
                                category = main_cat
                            else:
                                full = obj.get('baseCategoryFullPath', '')
                                if full:
                                    category = full.split('>')[0].strip()
                        except Exception:
                            pass
                    break

        # 3. meta og:description 파싱
        if not category:
            meta = soup.find('meta', {'property': 'og:description'})
            if meta and meta.get('content'):
                c = meta['content']
                # '브랜드' 또는 'Brand' 뒤는 제거
                if '브랜드' in c:
                    c = c.split('브랜드')[0]
                elif 'Brand' in c:
                    c = c.split('Brand')[0]
                # '제품분류 :' 또는 'Category :' 레이블 제거
                if ':' in c:
                    c = c.split(':', 1)[1]
                c = c.strip()
                # '>' 앞의 대분류
                category = c.split('>')[0].strip()

        # 4. 대분류 정규화
        if category:
            if category in self.main_categories:
                return category
            if category in self.category_mapping:
                return self.category_mapping[category]

        # 기본값
        return category or "상의"

    def train_with_data(self, training_data: list) -> list:
        """훈련 데이터로 테스트 및 검증"""
        results = []
        success = 0

        for item in training_data:
            url = item["url"]
            expected = item["category"]

            html = self.get_html_content(url)
            if not html:
                logger.warning(f"URL {url} 에서 HTML을 가져올 수 없음")
                continue

            soup = BeautifulSoup(html, 'html.parser')
            extracted = self.extract_category(soup)
            match = (extracted == expected)
            if match:
                success += 1

            results.append({
                "url": url,
                "expected": expected,
                "extracted": extracted,
                "match": match
            })

        total = len(results)
        accuracy = (success / total * 100) if total else 0
        logger.info("== 훈련 결과 요약 ==")
        logger.info(f"총 {total}개 중 {success}개 일치 (정확도: {accuracy:.2f}%)")

        for i, r in enumerate(results, 1):
            status = "✓" if r["match"] else "✗"
            logger.info(
                f"{i}. {status} URL: {r['url'][:50]}... | "
                f"예상: {r['expected']} | 추출: {r['extracted']}"
            )

        if accuracy >= 70:
            logger.info(f"정확도 {accuracy:.2f}%: 추출기 저장")
            self.save_extractor()
        else:
            logger.warning(f"정확도 {accuracy:.2f}%: 저장 생략")

        return results

    def save_extractor(self) -> bool:
        """추출기 객체 저장"""
        try:
            path = os.path.join(MODELS_DIR, "category_extractor.pkl")
            with open(path, "wb") as f:
                pickle.dump(self, f)
            logger.info(f"저장 완료: {path}")
            return True
        except Exception as e:
            logger.error(f"저장 오류: {e}")
            return False

    @classmethod
    def load_extractor(cls):
        """저장된 추출기 불러오기"""
        try:
            path = os.path.join(MODELS_DIR, "category_extractor.pkl")
            with open(path, "rb") as f:
                return pickle.load(f)
        except Exception as e:
            logger.error(f"로드 오류: {e}")
            return cls()


def train_musinsa_extractor():
    logger.info("무신사 카테고리 추출기 학습 시작")

    training_data = [
        {"url": "https://www.musinsa.com/products/3074973", "category": "상의"},
        {"url": "https://www.musinsa.com/products/4651524", "category": "상의"},
        {"url": "https://www.musinsa.com/products/4651528", "category": "상의"},
        {"url": "https://www.musinsa.com/products/5036577", "category": "상의"},
        {"url": "https://www.musinsa.com/products/4825004", "category": "상의"},
        {"url": "https://www.musinsa.com/products/5018263", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4998582", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4793690", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4651731", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4678582", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4668944", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/5045927", "category": "하의"},
        {"url": "https://www.musinsa.com/products/4989243", "category": "하의"},
        {"url": "https://www.musinsa.com/products/4915936", "category": "하의"},
        {"url": "https://www.musinsa.com/products/5061654", "category": "하의"},
        {"url": "https://www.musinsa.com/products/5026019", "category": "하의"},
        {"url": "https://www.musinsa.com/products/5062975", "category": "하의"},
        {"url": "https://www.musinsa.com/products/4894507", "category": "신발"},
        {"url": "https://www.musinsa.com/products/5018153", "category": "신발"},
        {"url": "https://www.musinsa.com/products/4778562", "category": "신발"},
        {"url": "https://www.musinsa.com/products/5051836", "category": "액세서리"},
        {"url": "https://www.musinsa.com/products/5076112", "category": "액세서리"},
        {"url": "https://www.musinsa.com/products/4987356", "category": "액세서리"},
        {"url": "https://www.musinsa.com/products/4707279", "category": "액세서리"},
    ]

    extractor = MusinsaCategoryExtractor()
    extractor.train_with_data(training_data)

    # 테스트 URL 검증
    test_url = "https://www.musinsa.com/products/3041643"
    logger.info(f"테스트 URL: {test_url}")
    html = extractor.get_html_content(test_url)
    if html:
        soup = BeautifulSoup(html, 'html.parser')
        cat = extractor.extract_category(soup)
        logger.info(f"테스트 결과: 카테고리 → {cat}")

    logger.info("학습 완료")
    return extractor


if __name__ == "__main__":
    train_musinsa_extractor()
