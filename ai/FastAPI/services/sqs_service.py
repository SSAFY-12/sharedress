import boto3
import json
import logging
from datetime import datetime

from config import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, SQS_QUEUE_URL

logger = logging.getLogger(__name__)

class SQSService:
    def __init__(self):
        """Initialize SQS client"""
        self.sqs_client = boto3.client(
            'sqs',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )
        self.queue_url = SQS_QUEUE_URL

    def receive_messages(self, max_messages=1, wait_time=20):
        """Receive messages from SQS queue"""
        try:
            response = self.sqs_client.receive_message(
                QueueUrl=self.queue_url,
                MaxNumberOfMessages=max_messages,
                WaitTimeSeconds=wait_time,  # Long polling
                AttributeNames=['All'],
                MessageAttributeNames=['All']
            )

            if 'Messages' in response:
                return response['Messages']
            return []

        except Exception as e:
            logger.error(f"Failed to receive messages from SQS: {e}")
            return []

    def delete_message(self, receipt_handle):
        """Delete a message from the queue"""
        try:
            self.sqs_client.delete_message(
                QueueUrl=self.queue_url,
                ReceiptHandle=receipt_handle
            )
            logger.info(f"Deleted message with receipt handle: {receipt_handle}")
            return True

        except Exception as e:
            logger.error(f"Failed to delete message from SQS: {e}")
            return False

    def parse_message(self, message):
        """Parse SQS message body"""
        try:
            body = json.loads(message['Body'])

            # Extract message attributes
            message_id = message.get('MessageId', '')
            receipt_handle = message.get('ReceiptHandle', '')

            # 디버깅: 원본 메시지 내용 로깅
            logger.info(f"Raw message body: {body}")

            # 메시지 타입 결정 (기존 + 사진 처리 추가)
            if 'taskId' in body and 'closetClothesId' in str(body):
                # 이것은 사진 처리 요청입니다
                # 디버깅: 항목 확인
                for i, item in enumerate(body.get('items', [])):
                    logger.info(f"Photo message item {i}: closetClothesId={item.get('closetClothesId')}, categoryId={item.get('categoryId', 'MISSING')}")

                return {
                    'message_id': message_id,
                    'receipt_handle': receipt_handle,
                    'message_type': 'photo',
                    'data': {
                        'taskId': body.get('taskId', ''),
                        'memberId': body.get('memberId', 0),
                        'items': body.get('items', [])
                    }
                }
            elif 'memberId' in body and 'items' in body:
                # 이것은 구매 이력 요청입니다
                return {
                    'message_id': message_id,
                    'receipt_handle': receipt_handle,
                    'message_type': 'purchase',
                    'data': {
                        'memberId': body.get('memberId'),
                        'fcmToken': body.get('fcmToken', ''),
                        'items': body.get('items', []),
                        'taskId': body.get('taskId', ''),
                        'isLast': body.get('isLast', True)
                    }
                }
            else:
                # 표준 상품 URL 요청
                url = body.get('url', '')
                desired_color = body.get('desired_color', None)

                return {
                    'message_id': message_id,
                    'receipt_handle': receipt_handle,
                    'message_type': 'product',
                    'data': {
                        'url': url,
                        'desired_color': desired_color
                    }
                }

        except Exception as e:
            logger.error(f"Failed to parse SQS message: {e}")
            return None