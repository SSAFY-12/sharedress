import requests
from bs4 import BeautifulSoup
import logging
import os
import pickle
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

class HTMLExtractor:
    """HTML 추출기 초기화"""

    def __init__(self):
        """HTML 추출기 초기화"""
        self.MODELS_DIR = "app/models/scrapers"
        self.headers = {
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/91.0.4472.124 Safari/537.36'
            )
        }
        self._load_extractors()

    def _load_extractors(self):
        """학습된 추출기 로드"""
        try:
            # 카테고리 추출기 직접 생성 (피클 로드 대신)
            # 이렇게 하면 피클링 관련 문제를 피할 수 있음
            from services.musinsa_extractor import get_extractor
            self.category_extractor = get_extractor()
            logger.info("카테고리 추출기 생성 성공")
        except Exception as e:
            logger.error(f"카테고리 추출기 생성 실패: {e}")
            self.category_extractor = None

    def extract_from_url(self, url: str, desired_color: Optional[str] = None) -> Dict[str, Any]:
        """URL에서 상품 정보 추출"""
        try:
            # HTML 콘텐츠 가져오기
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')

            # 상품 정보 추출
            result = {}

            # 1. 카테고리 추출
            result['category_text'] = self._extract_category(soup)

            # 2. 모든 이미지 URL 추출
            result['image_urls'] = self._extract_image_urls(url, soup, desired_color)

            return result

        except Exception as e:
            logger.error(f"URL {url}에서 정보 추출 실패: {e}")
            return {"error": str(e)}

    def _extract_category(self, soup: BeautifulSoup) -> str:
        """카테고리 정보 추출"""
        try:
            # 1. 추출기 사용 시도
            if self.category_extractor:
                try:
                    category = self.category_extractor.extract_category(soup)
                    logger.info(f"추출기로 카테고리 추출 성공: {category}")
                    return category
                except Exception as e:
                    logger.warning(f"추출기로 카테고리 추출 실패: {e}")

            # 2. 직접 파싱 시도
            # 카테고리 매핑 (세부 카테고리 → 대분류)
            category_mapping = {
                # 상의 (대분류 1)
                "티셔츠": "상의", "맨투맨": "상의", "후드": "상의", "셔츠": "상의", "니트": "상의", "스웨트셔츠": "상의",
                "카디건": "상의", "탑": "상의", "블라우스": "상의", "베스트": "상의", "폴로": "상의",

                # 아우터 (대분류 2)
                "자켓": "아우터", "코트": "아우터", "점퍼": "아우터", "패딩": "아우터", "무스탕": "아우터",
                "블레이저": "아우터", "가디건": "아우터", "짚업": "아우터", "재킷": "아우터", "윈드브레이커": "아우터",

                # 하의 (대분류 3)
                "바지": "하의", "청바지": "하의", "팬츠": "하의", "슬랙스": "하의", "데님": "하의", "레깅스": "하의",
                "스커트": "하의", "조거팬츠": "하의", "스웨트팬츠": "하의", "쇼츠": "하의", "진": "하의",

                # 신발 (대분류 4)
                "스니커즈": "신발", "구두": "신발", "로퍼": "신발", "샌들": "신발", "부츠": "신발", "힐": "신발",
                "슬리퍼": "신발", "슈즈": "신발",

                # 액세서리 (대분류 5)
                "가방": "액세서리", "모자": "액세서리", "양말": "액세서리", "쥬얼리": "액세서리", "벨트": "액세서리",
                "안경": "액세서리", "시계": "액세서리", "스카프": "액세서리", "넥타이": "액세서리", "키링": "액세서리",
                "머플러": "액세서리", "장갑": "액세서리"
            }

            # 직접 대분류 이름들
            main_categories = ["상의", "아우터", "하의", "신발", "액세서리"]

            # a. 무신사 카테고리 요소 확인 (data-category-name 속성)
            category_elements = soup.select('a[data-category-name]')
            if category_elements:
                for element in category_elements:
                    category_name = element.get('data-category-name')
                    if category_name in main_categories:
                        logger.info(f"카테고리 발견 (data-category-name): {category_name}")
                        return category_name

                    # 세부 카테고리인 경우 대분류로 매핑
                    if category_name in category_mapping:
                        main_category = category_mapping[category_name]
                        logger.info(f"세부 카테고리 '{category_name}'를 '{main_category}'로 매핑")
                        return main_category

                    # 텍스트 기반 매핑 시도
                    text = element.text.strip()
                    if text in main_categories:
                        logger.info(f"카테고리 발견 (텍스트): {text}")
                        return text
                    if text in category_mapping:
                        main_category = category_mapping[text]
                        logger.info(f"세부 카테고리 '{text}'를 '{main_category}'로 매핑")
                        return main_category

            # b. 무신사 템플릿 구조 검색
            category_paths = soup.select('.product_info_section .item_categories a, .sc-1prswe3-3, [class*="category_navi"]')
            if category_paths:
                for path in category_paths:
                    text = path.text.strip()
                    # 직접 대분류인 경우
                    if text in main_categories:
                        logger.info(f"카테고리 경로에서 발견: {text}")
                        return text
                    # 세부 카테고리인 경우
                    if text in category_mapping:
                        main_category = category_mapping[text]
                        logger.info(f"세부 카테고리 '{text}'를 '{main_category}'로 매핑")
                        return main_category

            # c. 메타 태그 확인
            meta_keywords = soup.find('meta', {'name': 'keywords'})
            if meta_keywords and meta_keywords.get('content'):
                keywords = meta_keywords['content'].split(',')
                for keyword in keywords:
                    keyword = keyword.strip()
                    if keyword in main_categories:
                        logger.info(f"메타 키워드에서 카테고리 발견: {keyword}")
                        return keyword
                    if keyword in category_mapping:
                        main_category = category_mapping[keyword]
                        logger.info(f"메타 키워드 '{keyword}'를 '{main_category}'로 매핑")
                        return main_category

            # 3. 기본값 반환
            logger.warning("카테고리를 찾을 수 없어 기본값 '상의' 반환")
            return "상의"

        except Exception as e:
            logger.error(f"카테고리 추출 중 오류: {e}")
            return "상의"  # 기본 카테고리

    def _extract_image_urls(self, url: str, soup: BeautifulSoup, desired_color: Optional[str] = None) -> List[str]:
        """상품 이미지 URL 추출"""
        image_urls = []

        try:
            # 1. 무신사 상품 갤러리 이미지 찾기
            gallery_images = soup.select('#detail_thumbs img, #bigimg img, .product-img img, .product_thumb img, .detail_product_img img')
            for img in gallery_images:
                src = img.get('src') or img.get('data-src') or img.get('data-original')
                if src:
                    # 작은 썸네일 이미지는 건너뛰기
                    if 'thumbnail' in src or '_30.jpg' in src:
                        continue

                    # 큰 이미지 URL로 변환 (무신사 패턴)
                    if '_60.jpg' in src:
                        src = src.replace('_60.jpg', '.jpg')
                    if '_80.jpg' in src:
                        src = src.replace('_80.jpg', '.jpg')

                    # 절대 URL 확인
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        domain = '/'.join(url.split('/')[:3])
                        src = domain + src

                    # gif 및 아이콘 제외
                    if not src.endswith('.gif') and 'icon' not in src.lower():
                        image_urls.append(src)

            # 2. OpenGraph 이미지 확인 (대체)
            if not image_urls:
                og_image = soup.select_one('meta[property="og:image"]')
                if og_image and og_image.get('content'):
                    image_urls.append(og_image['content'])

            # 3. 색상 옵션이 지정된 경우 필터링
            if desired_color and image_urls:
                # 색상 옵션 컨테이너 찾기
                color_containers = soup.select('.option_cont .list_option .option_btn')
                for container in color_containers:
                    color_name = container.get('data-color') or container.get('title') or container.text.strip()
                    if desired_color.lower() in color_name.lower():
                        # 색상 특정 이미지 찾기 (구현이 필요하다면)
                        pass

            return image_urls

        except Exception as e:
            logger.error(f"이미지 URL 추출 중 오류: {e}")
            return image_urls  # 빈 리스트 또는 지금까지 찾은 이미지 URL 반환