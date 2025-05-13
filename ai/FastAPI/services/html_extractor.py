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

            # 유효하지 않은 상품 체크
            # 알림창, 에러 메시지 또는 페이지 내용에서 "유효하지 않은 상품" 문구 확인
            # if "유효하지 않은 상품" in html or "상품을 찾을 수 없습니다" in html:
            #     logger.warning(f"유효하지 않은 상품 URL: {url}")
            #     return {"error": "INVALID_PRODUCT", "message": "유효하지 않은 상품입니다"}
            #
            # # 페이지가 비어있거나 주요 콘텐츠가 없는 경우 확인
            # if not soup.select('.product_info_section, .sc-1prswe3-3, [class*="category_navi"], .product-img'):
            #     logger.warning(f"상품 정보를 찾을 수 없는 URL: {url}")
            #     return {"error": "INVALID_PRODUCT", "message": "상품 정보를 찾을 수 없습니다"}

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


        except Exception as e:
            crumbs = [a.get("data-category-name") or a.text.strip()
                      for a in soup.select('a[data-category-name]')][:2]
            valid = {"상의","아우터","하의","신발","악세사리"}
            for c in crumbs:
                if c in valid:
                    logger.info("breadcrumb 선택: %s", c)
                    return c

        logger.warning("카테고리를 찾지 못해 기본값 '상의' 사용")
        return "상의"

    def _extract_image_urls(self, url: str, soup: BeautifulSoup, desired_color: Optional[str] = None) -> List[str]:
        """상품 이미지 URL 추출"""
        image_urls = []

        try:
            # 디버깅을 위한 HTML 구조 분석
            logger.info(f"URL 처리 시작: {url}")

            # 1. 새 무신사 UI 검색 (더 자세한 로깅)
            new_gallery_elements = soup.select('div.sc-366fl4-2, div.sc-366fl4-3')
            logger.info(f"새 UI div 요소 수: {len(new_gallery_elements)}")

            # 2. 모든 img 태그 확인
            all_images = soup.find_all('img')
            logger.info(f"페이지 전체 이미지 태그 수: {len(all_images)}")

            # 이미지 URL 패턴 확인을 위해 처음 5개 이미지의 src 출력
            for i, img in enumerate(all_images[:5]):
                src = img.get('src')
                if src:
                    logger.info(f"이미지 {i+1} src: {src}")
            # 1. 새 무신사 UI에서 갤러리 이미지 추출 (div.sc-366fl4-2 내부 이미지)
            new_gallery_images = soup.select('div.sc-366fl4-2 img, div.sc-366fl4-3 img')
            if new_gallery_images:
                logger.info(f"새 UI에서 갤러리 이미지 {len(new_gallery_images)}개 발견")
                for img in new_gallery_images:
                    src = img.get('src') or img.get('data-src')
                    if src:
                        # 썸네일 이미지 URL을 고품질 이미지 URL로 변환
                        if '_500.jpg' in src:
                            high_quality_src = src.replace('_500.jpg', '_big.jpg?w=1200')
                            image_urls.append(high_quality_src)
                            logger.info(f"고품질 이미지 URL 추출: {high_quality_src}")
                        else:
                            image_urls.append(src)

            # 2. 기존 무신사 갤러리 이미지 찾기 (결과가 없는 경우 대비)
            if not image_urls:
                gallery_images = soup.select('#detail_thumbs img, #bigimg img, .product-img img, .product_thumb img, .detail_product_img img')
                for img in gallery_images:
                    src = img.get('src') or img.get('data-src') or img.get('data-original')
                    if src:
                        # 작은 썸네일 이미지는 건너뛰기
                        if 'thumbnail' in src and '_30.jpg' in src:
                            continue

                        # 큰 이미지 URL로 변환 (무신사 패턴)
                        if '_500.jpg' in src:
                            src = src.replace('_500.jpg', '_big.jpg?w=1200')
                        elif '_60.jpg' in src:
                            src = src.replace('_60.jpg', '_big.jpg?w=1200')
                        elif '_80.jpg' in src:
                            src = src.replace('_80.jpg', '_big.jpg?w=1200')

                        # 절대 URL 확인
                        if src.startswith('//'):
                            src = 'https:' + src
                        elif src.startswith('/'):
                            domain = '/'.join(url.split('/')[:3])
                            src = domain + src

                        # gif 및 아이콘 제외
                        if not src.endswith('.gif') and 'icon' not in src.lower():
                            image_urls.append(src)

            # 3. OpenGraph 이미지 확인 (대체)
            if not image_urls:
                og_image = soup.select_one('meta[property="og:image"]')
                if og_image and og_image.get('content'):
                    src = og_image['content']
                    # 만약 OpenGraph 이미지가 500 크기라면 big으로 변환
                    if '_500.jpg' in src:
                        src = src.replace('_500.jpg', '_big.jpg?w=1200')
                    image_urls.append(src)

            # 중복 URL 제거
            image_urls = list(dict.fromkeys(image_urls))

            logger.info(f"총 {len(image_urls)}개의 이미지 URL 추출됨")
            return image_urls

        except Exception as e:
            logger.error(f"이미지 URL 추출 중 오류: {e}")
            return image_urls  # 빈 리스트 또는 지금까지 찾은 이미지 URL 반환