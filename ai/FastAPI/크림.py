import os
import re
import uuid
import boto3
import requests
from datetime import datetime
from io import BytesIO
from bs4 import BeautifulSoup
from PIL import Image
from sqlalchemy import create_engine, text
from urllib.parse import urljoin
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# DB 설정
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')  # 이미 'username@hostname' 형식
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_PORT = os.environ.get('DB_PORT')

# AWS 설정
S3_BUCKET = "ai-processing-output"  # S3 버킷 이름
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY')
AWS_REGION = os.environ.get('AWS_REGION', 'ap-northeast-2')

# Azure MariaDB에 맞는 연결 문자열 구성
DB_CONNECTION_STRING = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 설정
HTML_FILE_PATH = "polyteru_outer.html"  # 파싱할 HTML 파일 경로
KREAM_BASE_URL = "https://kream.co.kr"

# 데이터베이스 연결
print(f"DB 연결 시도: {DB_HOST}, {DB_NAME}, {DB_USER}")  # 디버깅용 (비밀번호는 제외)
engine = create_engine(DB_CONNECTION_STRING)

# S3 클라이언트 초기화
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

def read_html_file(file_path):
    """HTML 파일 읽기"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def download_image(url):
    """이미지 URL에서 이미지 다운로드"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://kream.co.kr/'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return BytesIO(response.content)
    except Exception as e:
        print(f"이미지 다운로드 실패: {url}, 오류: {e}")
        return None

def convert_webp_to_png(image_buffer):
    """WebP 이미지를 PNG로 변환"""
    try:
        image = Image.open(image_buffer)
        output_buffer = BytesIO()
        image.save(output_buffer, format="PNG")
        output_buffer.seek(0)
        return output_buffer
    except Exception as e:
        print(f"이미지 변환 실패: {e}")
        return None

def upload_to_s3(image_buffer, category_id, color_id):
    """S3에 이미지 업로드"""
    try:
        # 고유한 파일 이름 생성
        file_name = f"{category_id}_{color_id}_{uuid.uuid4()}.png"

        # S3에 업로드
        s3_client.upload_fileobj(
            image_buffer,
            S3_BUCKET,
            file_name,
            ExtraArgs={'ContentType': 'image/png'}
        )

        # S3 URL 생성
        s3_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{file_name}"
        print(f"S3 업로드 성공: {s3_url}")
        return s3_url
    except Exception as e:
        print(f"S3 업로드 실패: {e}")
        return None

def insert_to_db(product_data):
    """상품 정보를 DB에 저장"""
    try:
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S.000000')

        query = text("""
            INSERT INTO clothes
            (type, brand_id, category_id, color_id, created_at, shopping_mall_id, updated_at, goods_link_url, image_url, name)
            VALUES
            (1, 1100, 2, -1, :created_at, 2, :updated_at, :goods_link_url, :image_url, :name)
        """)

        with engine.connect() as connection:
            connection.execute(query, {
                'created_at': now,
                'updated_at': now,
                'goods_link_url': product_data['goods_link_url'],
                'image_url': product_data['image_url'],
                'name': product_data['name']
            })
            connection.commit()

        print(f"DB 저장 성공: {product_data['name']}")
        return True
    except Exception as e:
        print(f"DB 저장 실패: {e}")
        return False

def extract_products_from_html(html_content):
    """HTML에서 상품 정보 추출"""
    soup = BeautifulSoup(html_content, 'html.parser')
    products = []

    # 상품 카드 요소 찾기
    product_cards = soup.select("div.search_result_item.product")
    print(f"총 {len(product_cards)}개 상품 발견")

    for card in product_cards:
        try:
            # 상품 링크 추출
            link_element = card.select_one("a.item_inner")
            if not link_element:
                continue

            href = link_element.get('href')
            goods_link_url = urljoin(KREAM_BASE_URL, href)

            # 이미지 URL 추출
            img_element = card.select_one("[data-v-0869085a] source")
            if not img_element:
                continue

            img_url = img_element.get('srcset')
            if not img_url:
                continue

            # WebP URL에서 PNG URL로 변환 (필요한 경우)
            img_url = img_url.split('?')[0]  # 쿼리 파라미터 제거

            # 상품명 추출
            name_element = card.select_one(".translated_name")
            if not name_element:
                continue

            name = name_element.text.strip()

            products.append({
                'goods_link_url': goods_link_url,
                'img_url': img_url,
                'name': name
            })

        except Exception as e:
            print(f"상품 정보 추출 실패: {e}")
            continue

    return products

def process_products():
    """상품 처리 메인 함수"""
    try:
        # DB 연결 테스트
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("DB 연결 성공!")
    except Exception as e:
        print(f"DB 연결 테스트 실패: {e}")
        return

    # HTML 파일 읽기
    html_content = read_html_file(HTML_FILE_PATH)

    # 상품 정보 추출
    products = extract_products_from_html(html_content)
    print(f"{len(products)}개 상품 정보 추출 완료")

    for i, product in enumerate(products):
        print(f"\n처리 중 ({i+1}/{len(products)}): {product['name']}")
        print(f"  - 상품 URL: {product['goods_link_url']}")
        print(f"  - 이미지 URL: {product['img_url']}")

        # 이미지 다운로드
        img_buffer = download_image(product['img_url'])
        if not img_buffer:
            print(f"이미지 다운로드 실패, 건너뜀: {product['name']}")
            continue

        # 이미지 변환 (WebP -> PNG)
        png_buffer = convert_webp_to_png(img_buffer)
        if not png_buffer:
            print(f"이미지 변환 실패, 건너뜀: {product['name']}")
            continue

        # S3 업로드 (카테고리 ID는 5, 색상 ID는 -1)
        s3_url = upload_to_s3(png_buffer, 2, -1)
        if not s3_url:
            print(f"S3 업로드 실패, 건너뜀: {product['name']}")
            continue

        # DB에 저장
        product_data = {
            'goods_link_url': product['goods_link_url'],
            'image_url': s3_url,
            'name': product['name']
        }

        insert_result = insert_to_db(product_data)
        if insert_result:
            print(f"상품 처리 완료: {product['name']}")
        else:
            print(f"DB 저장 실패, 건너뜀: {product['name']}")

if __name__ == "__main__":
    process_products()