import boto3
import uuid
import logging
import requests
from io import BytesIO
from PIL import Image

from config import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, S3_BUCKET

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self):
        """Initialize S3 client"""
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )
        self.bucket_name = S3_BUCKET

    def upload_image(self, image_bytes, category_id, color_id):
        """Upload image to S3 and return the URI"""
        try:
            # Generate a unique file name
            file_name = f"{category_id}_{color_id}_{uuid.uuid4()}.png"

            # Upload file to S3
            self.s3_client.upload_fileobj(
                image_bytes,
                self.bucket_name,
                file_name,
                ExtraArgs={
                    'ContentType': 'image/png',
                    # 'ACL': 'public-read'  # Make the image publicly accessible
                }
            )

            # Generate the URI
            image_url = f"https://{self.bucket_name}.s3.{AWS_REGION}.amazonaws.com/{file_name}"
            logger.info(f"Uploaded image to S3: {image_url}")

            return image_url

        except Exception as e:
            logger.error(f"Failed to upload image to S3: {e}")
            return None

    def download_and_convert_if_needed(self, s3_url: str) -> BytesIO:
        """S3 URL에서 파일 다운로드하고 필요한 경우 변환"""
        try:
            # URL에서 키 추출
            if s3_url.startswith(f"https://{self.bucket_name}.s3."):
                key = s3_url.split(f"https://{self.bucket_name}.s3.{AWS_REGION}.amazonaws.com/")[1]
            else:
                # 다른 URL 형식 처리
                response = requests.get(s3_url, timeout=10)
                response.raise_for_status()
                buffer = BytesIO(response.content)
                return self._check_and_convert_heic(buffer)

            # S3에서 파일 다운로드
            buffer = BytesIO()
            self.s3_client.download_fileobj(self.bucket_name, key, buffer)
            buffer.seek(0)

            return self._check_and_convert_heic(buffer)
        except Exception as e:
            logger.error(f"S3 파일 다운로드 실패: {e}")
            return None

    def _check_and_convert_heic(self, buffer: BytesIO) -> BytesIO:
        """HEIC 파일인지 확인하고 필요시 PNG로 변환"""
        buffer.seek(0)
        header = buffer.read(12)
        buffer.seek(0)

        # HEIC 파일 헤더 확인
        is_heic = any(header.find(sig) != -1 for sig in [b'ftypheic', b'ftypmif1', b'ftyphevc', b'ftypheix'])

        if is_heic:
            try:
                from pillow_heif import register_heif_opener
                register_heif_opener()

                img = Image.open(buffer)
                output = BytesIO()
                img.convert("RGB").save(output, format="PNG")
                output.seek(0)
                return output
            except Exception as e:
                logger.error(f"HEIC 변환 실패: {e}")
                buffer.seek(0)

        return buffer