import requests
import os
import pickle
import json
import re
import logging
from bs4 import BeautifulSoup

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
            "조거팬츠": "하의", "스웨트팬츠": "하의",
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
            "패션소품": "액세서리",
             # 원피스/스커트 추가
             "원피스": "원피스/스커트", "드레스": "원피스/스커트", "스커트": "원피스/스커트",
             "점프수트": "원피스/스커트", "롬퍼": "원피스/스커트"
        }

        # 대분류 이름 목록
        self.main_categories = ["상의", "아우터", "하의", "신발", "액세서리", "원피스/스커트"]

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

# 클래스 생성
def get_extractor():
    extractor = MusinsaCategoryExtractor()
    return extractor