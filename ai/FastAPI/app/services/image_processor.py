import os
import json
import uuid
import requests
import boto3
import io
import numpy as np
import cv2
from PIL import Image
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from rembg import remove
from typing import Dict, List, Any, Tuple, Optional
import base64
from openai import OpenAI

class ImageProcessor:
    def __init__(self, openai_api_key: str, s3_access_key: str, s3_secret_key: str, s3_region: str, s3_bucket: str):
        """이미지 처리 서비스 초기화"""
        self.openai_client = OpenAI(api_key=openai_api_key)

        # S3 클라이언트 초기화
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=s3_access_key,
            aws_secret_access_key=s3_secret_key,
            region_name=s3_region
        )

        self.s3_bucket = s3_bucket

    async def extract_product_images(self, url: str) -> List[str]:
        """웹페이지에서 상품 이미지 URL 추출"""
        try:
            # HTTP 요청으로 페이지 가져오기
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            html = response.content

            # BeautifulSoup으로 파싱
            soup = BeautifulSoup(html, 'html.parser')

            # 메타데이터 추출
            metadata = self.extract_metadata(soup, url)

            # 이미지 URL 추출
            img_tags = soup.find_all('img')
            product_images = []

            # 상품 이미지일 가능성이 높은 이미지를 찾기
            for img in img_tags:
                src = img.get('src', '')
                if not src or src.startswith('data:'):
                    continue

                # 경로가 상대 경로인 경우 절대 경로로 변환
                abs_url = urljoin(url, src)

                # 이미지 필터링 (파일명, alt 태그, 클래스 등으로 판단)
                if self.is_likely_product_image(img, abs_url, metadata):
                    product_images.append(abs_url)

            # 상품 이미지가 없으면 더 일반적인 이미지 선택
            if not product_images:
                for img in img_tags:
                    src = img.get('src', '')
                    if not src or src.startswith('data:'):
                        continue

                    abs_url = urljoin(url, src)

                    # 이미지 크기 또는 위치로 상품 이미지 가능성 판단
                    width = img.get('width')
                    height = img.get('height')

                    # 크기가 있고 작지 않은 이미지 선택
                    if width and height and int(width) > 200 and int(height) > 200:
                        product_images.append(abs_url)

            # 중복 제거하고 최대 5개까지 반환
            unique_images = list(dict.fromkeys(product_images))
            return unique_images[:5]

        except Exception as e:
            print(f"Error extracting product images: {str(e)}")
            return []

    def extract_metadata(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """웹페이지에서 메타데이터 추출 (카테고리, 제품명, 브랜드)"""
        metadata = {
            "product_name": None,
            "brand": None,
            "category": None
        }

        # 제품명 추출
        # 1. 메타 태그에서 추출
        og_title = soup.find('meta', {'property': 'og:title'})
        if og_title:
            metadata["product_name"] = og_title.get('content')

        # 2. 제목 태그에서 추출
        if not metadata["product_name"]:
            title_tag = soup.find('title')
            if title_tag and title_tag.text:
                metadata["product_name"] = title_tag.text.strip()

        # 3. 헤딩 태그에서 추출
        if not metadata["product_name"]:
            h1_tag = soup.find('h1')
            if h1_tag:
                metadata["product_name"] = h1_tag.text.strip()

        # 브랜드 추출
        brand_meta = soup.find('meta', {'property': 'og:site_name'})
        if brand_meta:
            metadata["brand"] = brand_meta.get('content')

        # 카테고리 추출 (breadcrumb 등에서)
        breadcrumbs = soup.select('.breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]')
        if breadcrumbs:
            items = breadcrumbs[0].find_all('li')
            if items and len(items) > 1:
                metadata["category"] = items[-2].text.strip()  # 마지막에서 두 번째 항목이 보통

        return metadata

    def is_likely_product_image(self, img_tag, img_url: str, metadata: Dict[str, Any]) -> bool:
        """이미지가 상품 이미지인지 판단"""
        # 파일명에서 힌트 얻기
        filename = os.path.basename(urlparse(img_url).path).lower()

        # alt 태그 확인
        alt_text = img_tag.get('alt', '').lower()

        # 클래스 및 ID 확인
        img_class = img_tag.get('class', [])
        if isinstance(img_class, list):
            img_class = ' '.join(img_class).lower()
        else:
            img_class = str(img_class).lower()

        img_id = img_tag.get('id', '').lower()

        # 상품 이미지 관련 키워드
        product_keywords = ['product', 'item', 'goods', 'detail', 'thumbnail', 'main']

        # 제품명이 있으면 파일명이나 alt 태그에서 찾기
        product_name = metadata.get('product_name', '').lower()
        if product_name:
            product_name_words = product_name.split()
            if any(word in filename for word in product_name_words if len(word) > 3):
                return True
            if any(word in alt_text for word in product_name_words if len(word) > 3):
                return True

        # 파일명에 상품 관련 키워드가 있는지 확인
        if any(keyword in filename for keyword in product_keywords):
            return True

        # alt 태그에 상품 관련 키워드가 있는지 확인
        if any(keyword in alt_text for keyword in product_keywords):
            return True

        # 클래스나 ID에 상품 관련 키워드가 있는지 확인
        if any(keyword in img_class for keyword in product_keywords):
            return True

        if any(keyword in img_id for keyword in product_keywords):
            return True

        return False

    async def download_image(self, url: str) -> Optional[Image.Image]:
        """이미지 다운로드"""
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()

            # 이미지 객체로 변환
            return Image.open(io.BytesIO(response.content))

        except Exception as e:
            print(f"Error downloading image: {str(e)}")
            return None

    async def remove_background(self, image: Image.Image) -> Optional[Image.Image]:
        """배경 제거"""
        try:
            input_array = np.array(image)
            output_array = remove(input_array)
            return Image.fromarray(output_array)

        except Exception as e:
            print(f"Error removing background: {str(e)}")
            return None

    async def process_with_gpt(self, image: Image.Image, category: str) -> Optional[Image.Image]:
        """GPT를 사용한 이미지 처리"""
        try:
            # 이미지를 Base64로 인코딩
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # GPT-4o에 프롬프트 전송
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert in image manipulation."},
                    {"role": "user", "content": [
                        {"type": "text", "text": f"이 이미지에서 {category}를 분리해서 상품 이미지를 생성하고 이 이미지를 읽고 분리한 상품이미지를 생성, 상품 외 배경은 투명처리"},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_str}"}}
                    ]}
                ],
                max_tokens=1024
            )

            # 응답에서 이미지 URL 추출
            content = response.choices[0].message.content

            # 이미지가 base64로 응답되었는지 확인
            # base64_start = content.find("data:image/png;base64,")
            # if base64_start != -1:
            #     base64_start += len("data:image/png;base64,")
            #     base64_end = content.find("\n", base64_start)
            #     if base64_end == -1:
            #         base64_end = len(content)

            #     # Base64 디코딩 및 이미지 생성
            #     img_data = content[base64_start:base64_end].strip()
            #     img_bytes = base64.b64decode(img_data)
            #     return Image.open(io.BytesIO(img_bytes))

            # URL로 응답된 경우 (임시 URL)
            if "https://" in content:
                start_idx = content.find("https://")
                end_idx = content.find(" ", start_idx)
                if end_idx == -1:
                    end_idx = content.find("\n", start_idx)
                if end_idx == -1:
                    end_idx = len(content)

                img_url = content[start_idx:end_idx].strip()
                return await self.download_image(img_url)

            # 응답에 이미지가 없는 경우
            return None

        except Exception as e:
            print(f"Error processing with GPT: {str(e)}")
            return None

    async def extract_dominant_color(self, image: Image.Image) -> Dict[str, Any]:
        """지배적인 색상 추출"""
        try:
            # 이미지가 PIL.Image 형식이면 numpy 배열로 변환
            np_image = np.array(image)

            # RGBA 이미지인 경우 알파 채널 처리
            if np_image.shape[2] == 4:
                # 알파 채널이 투명한 픽셀은 무시
                mask = np_image[:, :, 3] > 0
                if np.sum(mask) > 0:  # 투명하지 않은 픽셀이 있는지 확인
                    foreground = np_image[mask]
                    np_image = foreground[:, :3]  # RGB 채널만 추출
                else:
                    np_image = np_image[:, :, :3]  # 알파 채널 제거

            # 이미지 리사이징 (빠른 처리를 위해)
            resized = cv2.resize(np_image, (100, 100))

            # OpenCV RGB -> HSV 변환
            hsv_image = cv2.cvtColor(resized, cv2.COLOR_RGB2HSV)

            # 이미지를 일차원 배열로 변환
            pixels = hsv_image.reshape(-1, 3).astype(np.float32)

            # K-means 클러스터링으로 주요 색상 추출
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            flags = cv2.KMEANS_RANDOM_CENTERS
            _, labels, centers = cv2.kmeans(pixels, 5, None, criteria, 10, flags)

            # 클러스터 크기 계산
            counts = np.bincount(labels.flatten())

            # 가장 많이 나타나는 클러스터 찾기
            dominant_cluster = np.argmax(counts)

            # 주요 색상 (HSV)
            dominant_color_hsv = centers[dominant_cluster].astype(np.uint8)

            # HSV -> RGB 변환
            rgb_pixel = np.uint8([[[dominant_color_hsv[0], dominant_color_hsv[1], dominant_color_hsv[2]]]])
            rgb_pixel = cv2.cvtColor(rgb_pixel, cv2.COLOR_HSV2RGB)
            dominant_color_rgb = rgb_pixel[0, 0]

            # RGB -> HEX 변환
            r, g, b = dominant_color_rgb
            hex_color = f'#{r:02x}{g:02x}{b:02x}'

            # HSV 기반 색상 분류
            h, s, v = dominant_color_hsv
            color_id = self.classify_color_tone(h, s, v)

            return {
                "color_id": color_id,
                "color_hex": hex_color,
                "hsv": [int(h), int(s), int(v)],
                "rgb": [int(r), int(g), int(b)]
            }

        except Exception as e:
            print(f"Error extracting color: {str(e)}")
            # 기본값 반환
            return {
                "color_id": 2,  # 기본 블랙 쿨
                "color_hex": "#000000",
                "hsv": [0, 0, 0],
                "rgb": [0, 0, 0]
            }

    def classify_color_tone(self, h: float, s: float, v: float) -> int:
        """HSV 값에 따라 컬러 ID 반환"""
        # HSV 값을 0-360, 0-100, 0-100 범위로 변환
        h = h * 2  # OpenCV는 H를 0-180 범위로 사용
        s = s / 255 * 100
        v = v / 255 * 100

        # 블랙 (Black)
        if v <= 15 and s <= 15:
            if 25 <= h <= 45:
                return 1  # 블랙 웜
            elif 210 <= h <= 270:
                return 2  # 블랙 쿨
            else:
                # 기본값으로 더 일반적인 쿨 블랙 반환
                return 2

        # 화이트 (White)
        if v >= 90 and s <= 10:
            if 30 <= h <= 60:
                return 3  # 화이트 웜
            elif 210 <= h <= 270:
                return 4  # 화이트 쿨
            else:
                # 기본값으로 더 일반적인 쿨 화이트 반환
                return 4

        # 그레이 (Gray)
        if 5 <= s <= 20 and 40 <= v <= 80:
            if 30 <= h <= 60:
                return 19  # 그레이 웜
            elif 210 <= h <= 270:
                return 20  # 그레이 쿨
            else:
                # 기본값으로 쿨 그레이 반환
                return 20

        # 레드 (Red)
        if s >= 80 and v >= 70:
            if 0 <= h <= 30:
                return 5  # 레드 웜 (오렌지빛 레드)
            elif 330 <= h <= 359:
                return 6  # 레드 쿨 (푸른빛 레드)
            # 경계선상의 레드
            elif h > 359 or h < 10:
                return 5  # 웜톤 레드로 판단

        # 블루 (Blue)
        if s >= 70 and v >= 70:
            if 180 <= h <= 210:
                return 7  # 블루 웜 (청록빛 블루)
            elif 220 <= h <= 250:
                return 8  # 블루 쿨 (네이비, 로얄 블루)
            # 경계선상의 블루
            elif 210 < h < 220:
                return 8  # 쿨톤 블루로 판단

        # 그린 (Green)
        if s >= 60 and v >= 60:
            if 80 <= h <= 140:
                return 9  # 그린 웜 (옐로우 그린, 올리브)
            elif 140 < h <= 180:
                return 10  # 그린 쿨 (블루 그린, 에메랄드)

        # 옐로우 (Yellow)
        if s >= 70 and v >= 80:
            if 45 <= h <= 65:
                return 11  # 옐로우 웜 (황금색, 머스타드)
            elif 65 < h <= 80:
                return 12  # 옐로우 쿨 (레몬 옐로우)

        # 퍼플 (Purple)
        if s >= 60 and v >= 60:
            if 280 <= h <= 320:
                return 13  # 퍼플 웜 (레드 바이올렛)
            elif 250 <= h < 280:
                return 14  # 퍼플 쿨 (블루 바이올렛)

        # 핑크 (Pink)
        if 30 <= s <= 70 and v >= 80:
            if 340 <= h <= 359:
                return 15  # 핑크 웜 (코랄, 피치 핑크)
            elif 280 <= h < 340:
                return 16  # 핑크 쿨 (베이비 핑크, 라벤더 핑크)

        # 브라운 (Brown)
        if 30 <= s <= 80 and 30 <= v <= 60:
            if 20 <= h <= 40:
                return 17  # 브라운 웜 (황갈색, 카라멜)
            elif 0 <= h < 20:
                return 18  # 브라운 쿨 (커피 브라운, 다크 초콜릿)

        # 기본값: 가장 가까운 색상 계산
        # hue를 기준으로 가장 가까운 색상군 선택
        if 330 <= h or h < 45:  # 레드 계열
            return 5 if s >= 50 else 1  # 채도에 따라 레드 또는 블랙
        elif 45 <= h < 80:  # 옐로우 계열
            return 11
        elif 80 <= h < 140:  # 그린 계열 (웜)
            return 9
        elif 140 <= h < 180:  # 그린 계열 (쿨)
            return 10
        elif 180 <= h < 220:  # 블루 계열 (웜)
            return 7
        elif 220 <= h < 250:  # 블루 계열 (쿨)
            return 8
        elif 250 <= h < 280:  # 퍼플 계열 (쿨)
            return 14
        elif 280 <= h < 320:  # 퍼플 계열 (웜)
            return 13
        else:  # 320 <= h < 330: 핑크/레드 경계
            return 15 if s < 70 else 5  # 채도에 따라 핑크 또는 레드

    def determine_category(self, url: str, metadata: Dict[str, Any]) -> int:
        """카테고리 ID 결정"""
        # 기본값은 상의(1)
        default_category_id = 1

        # URL이나 메타데이터에서 카테고리 힌트 찾기
        category_keywords = {
            "상의": ["티셔츠", "셔츠", "블라우스", "니트", "스웨터", "맨투맨", "후드", "탑", "top", "tee", "shirt", "blouse", "knit", "sweater"],
            "아우터": ["자켓", "코트", "패딩", "점퍼", "가디건", "바람막이", "아우터", "outerwear", "jacket", "coat", "padding", "jumper", "cardigan"],
            "하의": ["바지", "팬츠", "청바지", "진", "스커트", "레깅스", "슬랙스", "bottom", "pants", "jeans", "skirt", "leggings", "slacks"],
            "신발": ["신발", "구두", "운동화", "슬리퍼", "샌들", "부츠", "로퍼", "shoes", "sneakers", "slipper", "sandal", "boots", "loafer"],
            "악세사리": ["악세사리", "가방", "모자", "벨트", "양말", "장갑", "스카프", "쥬얼리", "액세서리", "accessory", "bag", "hat", "belt", "socks", "gloves", "scarf", "jewelry"]
        }

        category_mapping = {
            "상의": 1,
            "아우터": 2,
            "하의": 3,
            "신발": 4,
            "악세사리": 5
        }

        url_lower = url.lower()
        product_name = metadata.get("product_name", "").lower() if metadata.get("product_name") else ""
        category_hint = metadata.get("category", "").lower() if metadata.get("category") else ""

        # URL과 메타데이터에서 카테고리 키워드 검색
        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in url_lower or keyword in product_name or keyword in category_hint:
                    return category_mapping[category]

        return default_category_id

    async def upload_to_s3(self, image: Image.Image, key: str) -> str:
        """이미지를 S3에 업로드"""
        try:
            # 이미지를 메모리에 저장
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)

            # S3에 업로드
            self.s3_client.put_object(
                Body=img_byte_arr.getvalue(),
                Bucket=self.s3_bucket,
                Key=key,
                ContentType='image/png'
            )

            # S3 URL 반환
            return f"s3://{self.s3_bucket}/{key}"

        except Exception as e:
            print(f"Error uploading to S3: {str(e)}")
            return ""

    async def process_images(self, url: str, clothes_id: int, member_id: int) -> Dict[str, Any]:
        """이미지 처리 파이프라인"""
        result = {
            "clothes_id": clothes_id,
            "image_uri": "",
            "color_id": 2,  # 기본값: 블랙 쿨
            "category_id": 1,  # 기본값: 상의
            "color_hex": "#000000",
            "status": "ERROR",
            "error": "Processing failed"
        }

        try:
            # 상품 정보 및 이미지 URL 추출
            product_images = await self.extract_product_images(url)

            if not product_images:
                return {
                    **result,
                    "error": "No product images found"
                }

            # 메타데이터 추출
            soup = BeautifulSoup(requests.get(url).content, 'html.parser')
            metadata = self.extract_metadata(soup, url)

            # 카테고리 결정
            category_id = self.determine_category(url, metadata)
            category_names = {1: "상의", 2: "아우터", 3: "하의", 4: "신발", 5: "악세사리"}
            category_name = category_names.get(category_id, "상의")

            # 이미지 처리
            processed_image = None

            # 단독 상품 이미지 처리
            for img_url in product_images:
                image = await self.download_image(img_url)
                if not image:
                    continue

                # 누끼 따기
                no_bg_image = await self.remove_background(image)

                if no_bg_image:
                    # 알파 채널 확인 (충분한 전경이 있는지)
                    np_image = np.array(no_bg_image)
                    if np_image.shape[2] == 4:  # RGBA
                        alpha_channel = np_image[:, :, 3]
                        foreground_pixels = np.count_nonzero(alpha_channel > 0)
                        total_pixels = alpha_channel.size

                        # 전체 이미지의 10% 이상이 전경이면 처리 성공
                        if foreground_pixels / total_pixels >= 0.1:
                            processed_image = no_bg_image
                            break

            # 단독 상품 이미지가 없으면 GPT로 처리
            if not processed_image:
                # 첫 번째 이미지로 GPT 처리 시도
                if product_images:
                    model_image = await self.download_image(product_images[0])
                    if model_image:
                        gpt_image = await self.process_with_gpt(model_image, category_name)
                        if gpt_image:
                            processed_image = gpt_image

            # 이미지 처리 실패
            if not processed_image:
                return {
                    **result,
                    "error": "Failed to process any images"
                }

            # 색상 추출
            color_result = await self.extract_dominant_color(processed_image)

            # S3에 업로드
            file_name = f"product_{clothes_id}_{uuid.uuid4()}.png"
            s3_key = f"{member_id}/{clothes_id}/{file_name}"
            image_uri = await self.upload_to_s3(processed_image, s3_key)

            if not image_uri:
                return {
                    **result,
                    "error": "Failed to upload image to S3"
                }

            # 결과 반환
            return {
                "clothes_id": clothes_id,
                "image_uri": image_uri,
                "color_id": color_result["color_id"],
                "category_id": category_id,
                "color_hex": color_result["color_hex"],
                "status": "SUCCESS"
            }

        except Exception as e:
            print(f"Error processing images: {str(e)}")
            return {
                **result,
                "error": str(e)
            }