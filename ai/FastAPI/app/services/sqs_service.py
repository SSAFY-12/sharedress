import boto3
import json
import uuid
from typing import List, Dict, Any, Optional
import asyncio

class SQSService:
    def __init__(self, aws_access_key: str, aws_secret_key: str, region_name: str, queue_url: str):
        """SQS 서비스 초기화"""
        self.aws_access_key = aws_access_key
        self.aws_secret_key = aws_secret_key
        self.region_name = region_name
        self.queue_url = queue_url

        # SQS 클라이언트 생성
        self.sqs = boto3.client(
            'sqs',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=region_name
        )

    async def send_message(self, message_body: Dict[str, Any]) -> str:
        """메시지를 SQS 큐에 전송"""
        # 비동기로 처리하기 위해 run_in_executor 사용
        loop = asyncio.get_event_loop()

        # 그룹 ID 생성 (사용자별 고유 ID)
        member_id = message_body.get('memberId', 0)
        message_group_id = f"user-{member_id}-{uuid.uuid4()}"

        # 중복 제거 ID 생성
        message_deduplication_id = str(uuid.uuid4())

        # 메시지 전송
        response = await loop.run_in_executor(
            None,
            lambda: self.sqs.send_message(
                QueueUrl=self.queue_url,
                MessageBody=json.dumps(message_body),
                MessageGroupId=message_group_id,
                MessageDeduplicationId=message_deduplication_id
            )
        )

        return response.get('MessageId', '')

    async def receive_messages(self, max_messages: int = 10, wait_time_seconds: int = 10) -> List[Dict[str, Any]]:
        """SQS 큐에서 메시지 수신"""
        loop = asyncio.get_event_loop()

        response = await loop.run_in_executor(
            None,
            lambda: self.sqs.receive_message(
                QueueUrl=self.queue_url,
                MaxNumberOfMessages=max_messages,
                WaitTimeSeconds=wait_time_seconds,
                AttributeNames=['All'],
                MessageAttributeNames=['All']
            )
        )

        messages = response.get('Messages', [])
        processed_messages = []

        for message in messages:
            try:
                # 메시지 바디 파싱
                body = json.loads(message.get('Body', '{}'))

                # 메시지 속성 가져오기
                attributes = message.get('Attributes', {})
                message_group_id = attributes.get('MessageGroupId', '')

                processed_messages.append({
                    'message_id': message.get('MessageId', ''),
                    'receipt_handle': message.get('ReceiptHandle', ''),
                    'body': body,
                    'message_group_id': message_group_id
                })
            except json.JSONDecodeError:
                print(f"Error parsing message body: {message.get('Body', '')}")

        return processed_messages

    async def delete_message(self, receipt_handle: str) -> bool:
        """메시지 삭제"""
        loop = asyncio.get_event_loop()

        try:
            await loop.run_in_executor(
                None,
                lambda: self.sqs.delete_message(
                    QueueUrl=self.queue_url,
                    ReceiptHandle=receipt_handle
                )
            )
            return True
        except Exception as e:
            print(f"Error deleting message: {str(e)}")
            return False