import json
import asyncio
import httpx
from typing import Dict, Any, List
import traceback
from app.services.sqs_service import SQSService
from app.services.image_processor import ImageProcessor
from app.services.db_service import DBService
from app.config import settings

async def process_message(
        message: Dict[str, Any],
        sqs_service: SQSService,
        image_processor: ImageProcessor,
        db_service: DBService
) -> None:
    """SQS 메시지 처리"""
    try:
        # 메시지 데이터 추출
        receipt_handle = message.get('receipt_handle')
        body = message.get('body', {})
        message_group_id = message.get('message_group_id', '')

        # 메시지 내용 추출
        member_id = body.get('memberId')
        fcm_token = body.get('fcmToken')
        items = body.get('items', [])

        print(f"Processing message for member {member_id} with {len(items)} items")

        # 모든 아이템 처리
        processed_items = 0
        total_items = len(items)

        # 동시에 여러 아이템 처리 (병렬 처리)
        tasks = []
        for item in items:
            clothes_id = item.get('clothesId')
            link_url = item.get('linkUrl')

            # 이미지 처리 태스크 생성
            task = process_item(
                image_processor=image_processor,
                db_service=db_service,
                clothes_id=clothes_id,
                link_url=link_url,
                member_id=member_id
            )
            tasks.append(task)

        # 모든 태스크 실행
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # 처리 결과 확인
        successful_items = 0
        for result in results:
            if isinstance(result, Exception):
                print(f"Item processing error: {str(result)}")
            elif result and result.get('status') == 'SUCCESS':
                successful_items += 1

        # 모든 아이템 처리 완료 후 완료 API 호출
        if successful_items > 0:
            await call_completion_api(member_id, fcm_token)

        # 메시지 삭제
        await sqs_service.delete_message(receipt_handle)

        print(f"Completed processing message for member {member_id}: {successful_items}/{total_items} items successful")

    except Exception as e:
        print(f"Error processing message: {str(e)}")
        traceback.print_exc()

async def process_item(
        image_processor: ImageProcessor,
        db_service: DBService,
        clothes_id: int,
        link_url: str,
        member_id: int
) -> Dict[str, Any]:
    """단일 아이템 처리"""
    try:
        # 이미지 처리
        result = await image_processor.process_images(
            url=link_url,
            clothes_id=clothes_id,
            member_id=member_id
        )

        # 처리 성공 시 DB 업데이트
        if result and result.get('status') == 'SUCCESS':
            # DB 업데이트
            await db_service.update_clothes(
                clothes_id=clothes_id,
                image_uri=result.get('image_uri', ''),
                color_id=result.get('color_id', 2),
                category_id=result.get('category_id', 1)
            )

        return result

    except Exception as e:
        print(f"Error processing item {clothes_id}: {str(e)}")
        return {
            "clothes_id": clothes_id,
            "status": "ERROR",
            "error": str(e)
        }

async def call_completion_api(member_id: int, fcm_token: str) -> bool:
    """완료 API 호출"""
    try:
        completion_data = {
            "memberId": member_id,
            "fcmToken": fcm_token
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.COMPLETION_API_URL,
                json=completion_data,
                timeout=30.0
            )

            # 응답 확인
            if response.status_code == 200:
                print(f"Successfully called completion API for member {member_id}")
                return True
            else:
                print(f"Error calling completion API: {response.status_code}, {response.text}")
                return False

    except Exception as e:
        print(f"Exception calling completion API: {str(e)}")
        return False
