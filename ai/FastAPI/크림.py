import os
import re
import uuid
import boto3
import requests
import logging
import argparse
from datetime import datetime
from io import BytesIO
from bs4 import BeautifulSoup
from PIL import Image
from sqlalchemy import create_engine, text
from urllib.parse import urljoin
from dotenv import load_dotenv
from rembg import remove  # 배경 제거 라이브러리 추가

# .env 파일 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("product_import.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

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
KREAM_BASE_URL = "https://kream.co.kr"

# 명령줄 인수 파싱 함수
def parse_args():
    parser = argparse.ArgumentParser(description='HTML 파일에서 상품 정보를 추출하여 DB에 저장합니다.')
    parser.add_argument('--html', type=str, help='파싱할 HTML 파일 경로')
    parser.add_argument('--brand', type=int, help='브랜드 ID')
    parser.add_argument('--category', type=int, help='카테고리 ID')
    parser.add_argument('--shopping_mall', type=int, default=2, help='쇼핑몰 ID (기본값: 2)')
    return parser.parse_args()

# 사용자 입력 함수
def get_user_input(args):
    # HTML 파일 경로
    html_file_path = args.html if args.html else input("HTML 파일 경로를 입력하세요: ")
    while not os.path.exists(html_file_path):
        print(f"파일이 존재하지 않습니다: {html_file_path}")
        html_file_path = input("HTML 파일 경로를 다시 입력하세요: ")

    # 브랜드 ID
    while True:
        try:
            brand_id = args.brand if args.brand is not None else int(input("브랜드 ID를 입력하세요: "))
            break
        except ValueError:
            print("브랜드 ID는 숫자여야 합니다.")

    # 카테고리 ID
    while True:
        try:
            category_id = args.category if args.category is not None else int(input("카테고리 ID를 입력하세요 (1=상의, 2=아우터, 3=하의, 4=신발, 5=액세서리): "))
            if category_id not in [1, 2, 3, 4, 5]:
                print("카테고리 ID는 1~5 사이여야 합니다.")
                args.category = None  # 잘못된 값이면 다시 입력받기 위해
                continue
            break
        except ValueError:
            print("카테고리 ID는 숫자여야 합니다.")

    # 쇼핑몰 ID
    shopping_mall_id = args.shopping_mall

    return html_file_path, brand_id, category_id, shopping_mall_id

# 데이터베이스 연결
def connect_to_db():
    logger.info(f"DB 연결 시도: {DB_HOST}, {DB_NAME}, {DB_USER}")  # 디버깅용 (비밀번호는 제외)
    return create_engine(DB_CONNECTION_STRING)

# S3 클라이언트 초기화
def initialize_s3_client():
    return boto3.client(
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
        logger.error(f"이미지 다운로드 실패: {url}, 오류: {e}")
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
        logger.error(f"이미지 변환 실패: {e}")
        return None

def remove_background(image_buffer):
    """이미지 배경 제거 (누끼)"""
    try:
        # 버퍼 위치 초기화
        image_buffer.seek(0)

        # rembg 라이브러리를 사용하여 배경 제거
        result_bytes = remove(image_buffer.getvalue())
        result_buffer = BytesIO(result_bytes)

        # 디버깅을 위해 원본 및 처리 후 이미지 크기 비교
        image_buffer.seek(0)
        original_size = len(image_buffer.getvalue())
        processed_size = len(result_bytes)
        logger.info(f"배경 제거 완료: 원본 {original_size} 바이트 → 처리 후 {processed_size} 바이트")

        return result_buffer
    except Exception as e:
        logger.error(f"배경 제거 실패: {e}")
        return None

def upload_to_s3(image_buffer, category_id, color_id, s3_client):
    """S3에 이미지 업로드"""
    try:
        # 고유한 파일 이름 생성
        file_name = f"{category_id}_{color_id}_{uuid.uuid4()}.png"

        # 버퍼 위치 초기화
        image_buffer.seek(0)

        # S3에 업로드
        s3_client.upload_fileobj(
            image_buffer,
            S3_BUCKET,
            file_name,
            ExtraArgs={'ContentType': 'image/png'}
        )

        # S3 URL 생성
        s3_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{file_name}"
        logger.info(f"S3 업로드 성공: {s3_url}")
        return s3_url
    except Exception as e:
        logger.error(f"S3 업로드 실패: {e}")
        return None

def insert_to_db(product_data, engine, brand_id, category_id, shopping_mall_id):
    """상품 정보를 DB에 저장"""
    try:
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S.000000')

        query = text("""
            INSERT INTO clothes
            (type, brand_id, category_id, color_id, created_at, shopping_mall_id, updated_at, goods_link_url, image_url, name)
            VALUES
            (1, :brand_id, :category_id, -1, :created_at, :shopping_mall_id, :updated_at, :goods_link_url, :image_url, :name)
        """)

        with engine.connect() as connection:
            connection.execute(query, {
                'brand_id': brand_id,
                'category_id': category_id,
                'shopping_mall_id': shopping_mall_id,
                'created_at': now,
                'updated_at': now,
                'goods_link_url': product_data['goods_link_url'],
                'image_url': product_data['image_url'],
                'name': product_data['name']
            })
            connection.commit()

        logger.info(f"DB 저장 성공: {product_data['name']}")
        return True
    except Exception as e:
        logger.error(f"DB 저장 실패: {e}")
        return False

def extract_products_from_html(html_content):
    """HTML에서 상품 정보 추출"""
    soup = BeautifulSoup(html_content, 'html.parser')
    products = []

    # 상품 카드 요소 찾기
    product_cards = soup.select("div.search_result_item.product")
    logger.info(f"총 {len(product_cards)}개 상품 발견")

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
            logger.error(f"상품 정보 추출 실패: {e}")
            continue

    return products

def process_products(html_file_path, brand_id, category_id, shopping_mall_id):
    """상품 처리 메인 함수"""
    # 데이터베이스 연결
    engine = connect_to_db()

    # S3 클라이언트 초기화
    s3_client = initialize_s3_client()

    try:
        # DB 연결 테스트
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            logger.info("DB 연결 성공!")
    except Exception as e:
        logger.error(f"DB 연결 테스트 실패: {e}")
        return

    # 입력 정보 표시
    logger.info(f"처리 시작: HTML={html_file_path}, 브랜드ID={brand_id}, 카테고리ID={category_id}, 쇼핑몰ID={shopping_mall_id}")

    # HTML 파일 읽기
    html_content = read_html_file(html_file_path)

    # 상품 정보 추출
    products = extract_products_from_html(html_content)
    logger.info(f"{len(products)}개 상품 정보 추출 완료")

    # 성공/실패 통계
    stats = {"total": len(products), "success": 0, "failed": 0}

    for i, product in enumerate(products):
        logger.info(f"\n처리 중 ({i+1}/{len(products)}): {product['name']}")
        logger.info(f"  - 상품 URL: {product['goods_link_url']}")
        logger.info(f"  - 이미지 URL: {product['img_url']}")

        # 이미지 다운로드
        img_buffer = download_image(product['img_url'])
        if not img_buffer:
            logger.error(f"이미지 다운로드 실패, 건너뜀: {product['name']}")
            stats["failed"] += 1
            continue

        # 이미지 변환 (WebP -> PNG)
        png_buffer = convert_webp_to_png(img_buffer)
        if not png_buffer:
            logger.error(f"이미지 변환 실패, 건너뜀: {product['name']}")
            stats["failed"] += 1
            continue

        # 배경 제거 (누끼) - 새로 추가된 부분
        processed_buffer = remove_background(png_buffer)
        if not processed_buffer:
            logger.error(f"배경 제거 실패, 원본 이미지로 진행: {product['name']}")
            # 배경 제거 실패 시 원본 PNG 이미지 사용
            processed_buffer = png_buffer

        # S3 업로드
        s3_url = upload_to_s3(processed_buffer, category_id, -1, s3_client)
        if not s3_url:
            logger.error(f"S3 업로드 실패, 건너뜀: {product['name']}")
            stats["failed"] += 1
            continue

        # DB에 저장
        product_data = {
            'goods_link_url': product['goods_link_url'],
            'image_url': s3_url,
            'name': product['name']
        }

        insert_result = insert_to_db(product_data, engine, brand_id, category_id, shopping_mall_id)
        if insert_result:
            logger.info(f"상품 처리 완료: {product['name']}")
            stats["success"] += 1
        else:
            logger.error(f"DB 저장 실패, 건너뜀: {product['name']}")
            stats["failed"] += 1

        # 진행 상황 표시
        if (i + 1) % 5 == 0 or i + 1 == len(products):
            logger.info(f"진행 상황: {i+1}/{len(products)} 완료 (성공: {stats['success']}, 실패: {stats['failed']})")

    # 최종 결과 로깅
    logger.info(f"\n처리 완료: 총 {stats['total']}개 중 성공 {stats['success']}개, 실패 {stats['failed']}개")

if __name__ == "__main__":
    # 명령줄 인수 파싱
    args = parse_args()

    # 사용자 입력 받기
    html_file_path, brand_id, category_id, shopping_mall_id = get_user_input(args)

    # 상품 처리 시작
    process_products(html_file_path, brand_id, category_id, shopping_mall_id)