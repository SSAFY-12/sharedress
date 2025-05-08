import boto3
import uuid
import logging
from io import BytesIO

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
                    'ACL': 'public-read'  # Make the image publicly accessible
                }
            )

            # Generate the URI
            image_uri = f"https://{self.bucket_name}.s3.{AWS_REGION}.amazonaws.com/{file_name}"
            logger.info(f"Uploaded image to S3: {image_uri}")

            return image_uri

        except Exception as e:
            logger.error(f"Failed to upload image to S3: {e}")
            return None