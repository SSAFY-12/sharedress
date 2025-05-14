import requests
from bs4 import BeautifulSoup
import logging
import os
import pickle
from typing import Dict, List, Optional, Any
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

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
                'Chrome/114.0.0.0 Safari/537.36'
            ),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.musinsa.com/'
        }
        self._load_extractors()
        self.use_selenium = True  # 셀레니움 사용 여부 플래그

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
            # 상품 ID 추출
            product_id = url.split('/')[-1]
            logger.info(f"상품 ID: {product_id}")

            # 상품 정보 추출
            result = {}

            # 1. HTML 콘텐츠 가져오기 (셀레니움 사용하지 않을 경우를 위한 백업)
            html = ""
            soup = None
            try:
                response = requests.get(url, headers=self.headers)
                response.raise_for_status()
                html = response.text
                soup = BeautifulSoup(html, 'html.parser')
                logger.info(f"HTML 크기: {len(html)} 바이트")
            except Exception as e:
                logger.warning(f"requests로 HTML 가져오기 실패: {e}")

            # 2. 카테고리 추출 (BeautifulSoup으로 가능)
            if soup:
                result['category_text'] = self._extract_category(soup)
            else:
                result['category_text'] = "상의"  # 기본값

            # 3. Selenium으로 이미지 URL 추출
            if self.use_selenium:
                try:
                    selenium_urls = self._extract_images_with_selenium(url)
                    logger.info(f"Selenium으로 {len(selenium_urls)}개 이미지 URL 추출 성공")
                    result['image_urls'] = selenium_urls
                    return result
                except Exception as e:
                    logger.error(f"Selenium 이미지 추출 실패: {e}, 기존 방식으로 대체")

            # 4. 셀레니움 실패 시 기존 방식으로 대체
            if soup:
                result['image_urls'] = self._extract_image_urls(url, soup, desired_color)
            else:
                result['image_urls'] = []

            return result
        except Exception as e:
            logger.error(f"URL {url}에서 정보 추출 실패: {e}")
            return {"error": str(e)}

    def _extract_images_with_selenium(self, url: str) -> List[str]:
        """Selenium을 사용하여 JavaScript로 로딩된 이미지 추출 (최대 5개만)"""
        logger.info(f"Selenium으로 이미지 추출 시작: {url}")

        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        image_urls = []

        try:
            # 페이지 로드
            driver.get(url)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "img")))
            time.sleep(2)  # JavaScript가 로딩될 시간

            # 상품 ID 추출
            product_id = url.split('/')[-1]

            # 다양한 선택자 시도
            selectors = [
                'div.sc-366fl4-2 img',
                'div.sc-366fl4-3 img',
                'div.sc-9fdh7f-0 img',
                '.product_img_basic img',
                '#detail_thumbs img',
                '#bigimg img',
                '.product-img img',
                '.product_thumb img'
            ]

            # 최대 5개 이미지만 추출
            for selector in selectors:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    logger.info(f"선택자 '{selector}'로 {len(elements)}개 이미지 발견")

                    for element in elements:
                        src = element.get_attribute('src')
                        if src and src not in image_urls:
                            # 고품질 이미지 URL로 변환
                            if "_500.jpg" in src:
                                src = src.replace("_500.jpg", "_big.jpg?w=1200")
                            image_urls.append(src)

                            # 5개 이미지를 찾으면 중단
                            if len(image_urls) >= 3:
                                logger.info(f"5개 이미지 찾음, 검색 중단")
                                return image_urls

            # 특정 선택자로 이미지를 못 찾았다면 모든 이미지에서 무신사 패턴 찾기
            if not image_urls or len(image_urls) < 3:
                logger.info("특정 선택자로 충분한 이미지를 찾지 못해 모든 이미지 검색")
                all_images = driver.find_elements(By.TAG_NAME, 'img')
                for element in all_images:
                    src = element.get_attribute('src')
                    if src and src not in image_urls:
                        # 무신사 이미지 URL 패턴 확인
                        if any(pattern in src for pattern in ['goods_img', 'prd_img', 'image.msscdn.net']):
                            # 고품질 이미지 URL로 변환
                            if "_500.jpg" in src:
                                src = src.replace("_500.jpg", "_big.jpg?w=1200")
                            image_urls.append(src)

                            # 5개 이미지를 찾으면 중단
                            if len(image_urls) >= 3:
                                logger.info(f"5개 이미지 찾음, 검색 중단")
                                break

            # 중복 URL 제거
            image_urls = list(dict.fromkeys(image_urls))[:3]  # 최대 5개로 제한

            logger.info(f"Selenium으로 {len(image_urls)}개 이미지 URL 추출됨")

            return image_urls

        finally:
            driver.quit()

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
        """상품 이미지 URL 추출 (BeautifulSoup 기반, 백업용)"""
        image_urls = []

        try:
            # OpenGraph 이미지 확인
            og_image = soup.select_one('meta[property="og:image"]')
            if og_image and og_image.get('content'):
                src = og_image['content']
                # 만약 OpenGraph 이미지가 500 크기라면 big으로 변환
                if '_500.jpg' in src:
                    src = src.replace('_500.jpg', '_big.jpg?w=1200')
                image_urls.append(src)
                logger.info(f"OpenGraph 이미지 URL 추출: {src}")

            # 중복 URL 제거
            image_urls = list(dict.fromkeys(image_urls))

            logger.info(f"총 {len(image_urls)}개의 이미지 URL 추출됨")
            return image_urls

        except Exception as e:
            logger.error(f"이미지 URL 추출 중 오류: {e}")
            return image_urls  # 빈 리스트 또는 지금까지 찾은 이미지 URL 반환