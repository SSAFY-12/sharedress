import os
import asyncio
import logging
import re
import uuid
import boto3
import requests
from datetime import datetime
from io import BytesIO
from PIL import Image
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from rembg import remove  # 배경 제거 라이브러리

# .env 파일 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("closet_image_update.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# DB 설정
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_PORT = os.environ.get('DB_PORT')

# AWS 설정
S3_BUCKET = os.environ.get('S3_BUCKET', 'ai-processing-output')
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY')
AWS_REGION = os.environ.get('AWS_REGION', 'ap-northeast-2')

# 데이터베이스 연결
DB_CONNECTION_STRING = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
logger.info(f"DB 연결 시도: {DB_HOST}, {DB_NAME}, {DB_USER}")
engine = create_engine(DB_CONNECTION_STRING)

# S3 클라이언트 초기화
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

class ClosetImageUpdater:
    def __init__(self, closet_id=4):
        """옷장 이미지 업데이터 초기화"""
        self.engine = engine
        self.closet_id = closet_id

        # 처리 결과 통계
        self.stats = {
            "total": 0,
            "success": 0,
            "failed": 0,
            "skipped": 0
        }

    def get_closet_clothes_ids(self):
        """closet_id가 4인 모든 clothes_id 가져오기"""
        try:
            with self.engine.connect() as conn:
                query = text("""
                    SELECT clothes_id 
                    FROM closet_clothes 
                    WHERE closet_id = :closet_id
                """)
                result = conn.execute(query, {"closet_id": self.closet_id})
                clothes_ids = [row[0] for row in result]

            logger.info(f"옷장 ID {self.closet_id}에서 {len(clothes_ids)}개 옷 ID 가져옴")
            return clothes_ids

        except Exception as e:
            logger.error(f"옷장 옷 ID 조회 오류: {e}")
            return []

    async def process_all_clothes(self):
        """모든 옷 처리"""
        clothes_ids = self.get_closet_clothes_ids()
        self.stats["total"] = len(clothes_ids)

        if not clothes_ids:
            logger.warning(f"옷장 ID {self.closet_id}에 옷이 없습니다.")
            return

        logger.info(f"총 {len(clothes_ids)}개 옷 처리 시작")

        # 각 옷 처리
        for idx, clothes_id in enumerate(clothes_ids):
            await self.process_clothes(clothes_id)
            # 진행 상황 로깅
            if (idx + 1) % 10 == 0 or idx + 1 == len(clothes_ids):
                logger.info(f"진행 상황: {idx + 1}/{len(clothes_ids)} 완료 (성공: {self.stats['success']}, 실패: {self.stats['failed']})")
            # 서버 부하 방지용 대기
            await asyncio.sleep(0.5)

        logger.info(f"처리 완료: 성공={self.stats['success']}, 실패={self.stats['failed']}, 건너뜀={self.stats['skipped']}")

    async def process_clothes(self, clothes_id):
        """개별 옷 처리"""
        try:
            # clothes 테이블에서 정보 조회
            with self.engine.connect() as conn:
                query = text("""
                    SELECT id, category_id, color_id, image_url 
                    FROM clothes 
                    WHERE id = :clothes_id
                """)
                result = conn.execute(query, {"clothes_id": clothes_id})
                clothes_info = result.fetchone()

            if not clothes_info:
                logger.warning(f"옷 ID {clothes_id}: 데이터베이스에 존재하지 않음")
                self.stats["skipped"] += 1
                return

            id, category_id, color_id, image_url = clothes_info

            if not image_url:
                logger.warning(f"옷 ID {clothes_id}: 이미지 URL 없음")
                self.stats["skipped"] += 1
                return

            logger.info(f"옷 ID {clothes_id} 처리 시작: {image_url}")

            # 이미지 다운로드
            try:
                image_buf = await self.download_image(image_url)
                if not image_buf:
                    logger.error(f"옷 ID {clothes_id}: 이미지 다운로드 실패")
                    self.stats["failed"] += 1
                    return
            except Exception as e:
                logger.error(f"옷 ID {clothes_id}: 이미지 다운로드 오류 - {e}")
                self.stats["failed"] += 1
                return

            # 이미지 누끼 처리
            try:
                processed_buf = self.remove_background(image_buf)
                if not processed_buf:
                    logger.error(f"옷 ID {clothes_id}: 누끼 처리 실패")
                    self.stats["failed"] += 1
                    return
            except Exception as e:
                logger.error(f"옷 ID {clothes_id}: 누끼 처리 오류 - {e}")
                self.stats["failed"] += 1
                return

            # S3 업로드
            try:
                s3_url = self.upload_to_s3(processed_buf, category_id, color_id)

                if not s3_url:
                    logger.error(f"옷 ID {clothes_id}: S3 업로드 실패")
                    self.stats["failed"] += 1
                    return

                logger.info(f"옷 ID {clothes_id}: S3 업로드 성공 - {s3_url}")
            except Exception as e:
                logger.error(f"옷 ID {clothes_id}: S3 업로드 오류 - {e}")
                self.stats["failed"] += 1
                return

            # DB 업데이트
            try:
                with self.engine.connect() as conn:
                    update_query = text("""
                        UPDATE clothes 
                        SET image_url = :image_url 
                        WHERE id = :clothes_id
                    """)
                    conn.execute(update_query, {"image_url": s3_url, "clothes_id": clothes_id})
                    conn.commit()

                logger.info(f"옷 ID {clothes_id}: DB 업데이트 성공")
                self.stats["success"] += 1
            except Exception as e:
                logger.error(f"옷 ID {clothes_id}: DB 업데이트 오류 - {e}")
                self.stats["failed"] += 1

        except Exception as e:
            logger.error(f"옷 ID {clothes_id}: 처리 중 예상치 못한 오류 - {e}")
            self.stats["failed"] += 1

    async def download_image(self, url):
        """이미지 URL에서 다운로드"""
        try:
            def _download():
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                response = requests.get(url, headers=headers, timeout=15)
                response.raise_for_status()
                return BytesIO(response.content)

            # 비동기 실행을 위한 이벤트 루프에서 실행
            return await asyncio.get_event_loop().run_in_executor(None, _download)
        except Exception as e:
            logger.error(f"이미지 다운로드 실패 ({url}): {e}")
            return None

    def remove_background(self, image_buf):
        """이미지 배경 제거"""
        try:
            # rembg 라이브러리를 사용하여 배경 제거
            image_buf.seek(0)
            result_bytes = remove(image_buf.getvalue())
            return BytesIO(result_bytes)
        except Exception as e:
            logger.error(f"배경 제거 실패: {e}")
            return None

    def upload_to_s3(self, image_buf, category_id, color_id):
        """이미지를 S3에 업로드"""
        try:
            # 고유한 파일 이름 생성
            file_name = f"{category_id}_{color_id}_{uuid.uuid4()}.png"

            # 버퍼 위치 초기화
            image_buf.seek(0)

            # S3에 업로드
            s3_client.upload_fileobj(
                image_buf,
                S3_BUCKET,
                file_name,
                ExtraArgs={
                    'ContentType': 'image/png',
                }
            )

            # S3 URL 생성
            s3_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{file_name}"
            return s3_url

        except Exception as e:
            logger.error(f"S3 업로드 실패: {e}")
            return None

async def main():
    """메인 함수"""
    # 옷장 ID 설정 (기본값: 4)
    closet_id = int(os.environ.get("CLOSET_ID", "4"))

    logger.info(f"옷장 ID {closet_id}의 이미지 처리 시작")

    updater = ClosetImageUpdater(closet_id)
    await updater.process_all_clothes()

    logger.info("모든 처리 완료")

if __name__ == "__main__":
    asyncio.run(main())