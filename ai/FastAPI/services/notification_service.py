import json
import logging
import httpx
from typing import Union, List, Optional

from config import COMPLETION_API_URL, API_DOMAIN
from models.dto import ProductProcessingResult
from models.purchase_dto import PurchaseProcessingResult
from models.photo_dto import PhotoProcessingResult

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        """Initialize notification service"""
        self.completion_api_url = COMPLETION_API_URL
        # 사진 완료 API URL
        self.photo_completion_api_url = f"{API_DOMAIN}/api/photo/ai-complete"

    async def send_completion_notification(
            self,
            result: Union[ProductProcessingResult, List[PurchaseProcessingResult], List[PhotoProcessingResult]],
            original_task_id: Optional[str] = None
    ):
        """Send completion notification to the backend server"""
        try:
            # 사진 처리 결과 확인
            if isinstance(result, list) and len(result) > 0 and isinstance(result[0], PhotoProcessingResult):
                return await self.send_photo_completion_notification(result, original_task_id)

            # 요청 데이터 구성 변경
            if isinstance(result, list) and len(result) > 0:
                # 배치 처리 (구매 처리)
                member_id = result[0].memberId

                # 외부에서 전달받은 task_id가 있으면 우선 사용
                task_id = original_task_id or getattr(result[0], 'message_id', 'unknown_task')

                # 디버깅 로그 추가
                logger.info(f"Using task_id: {task_id} for notification")

                # 성공/실패 배열 분리
                success_clothes = []
                fail_clothes = []

                for item in result:
                    if item.processing_status == "SUCCESS":
                        success_clothes.append(item.clothesId)
                    else:
                        fail_clothes.append(item.clothesId)

                # 수정된 요청 형식에 맞게 구성
                request_data = {
                    "memberId": member_id,
                    "taskId": task_id,
                    "successClothes": success_clothes,
                    "failClothes": fail_clothes
                }

                logger.info(f"Sending completion notification: memberId={member_id}, success={len(success_clothes)}, fail={len(fail_clothes)}")

            else:
                # 단일 상품 처리
                # 단일 상품 처리의 경우도 같은 형식으로 통일
                if isinstance(result, ProductProcessingResult):
                    # 단일 상품 처리는 memberId 필드가 없으므로 기본값 0 사용
                    member_id = 0

                    # 외부에서 전달받은 task_id가 있으면 우선 사용
                    task_id = original_task_id or getattr(result, 'message_id', 'unknown_task')

                    if result.processing_status == "SUCCESS":
                        success_clothes = [1]  # 단일 상품의 경우 의미 있는 ID가 없으므로 임의로 1 설정
                        fail_clothes = []
                    else:
                        success_clothes = []
                        fail_clothes = [1]  # 단일 상품의 경우 의미 있는 ID가 없으므로 임의로 1 설정

                    request_data = {
                        "memberId": member_id,
                        "taskId": task_id,
                        "successClothes": success_clothes,
                        "failClothes": fail_clothes
                    }
                else:
                    # 결과가 없는 경우 빈 데이터 전송
                    request_data = {
                        "memberId": 0,
                        "taskId": original_task_id or "unknown_task",
                        "successClothes": [],
                        "failClothes": []
                    }

                logger.info(f"Sending single product completion notification")

            # 서버에 전송
            logger.info(f"Sending request to {self.completion_api_url} with data: {request_data}")
            async with httpx.AsyncClient(timeout=30000.0) as client:
                response = await client.post(
                    self.completion_api_url,
                    json=request_data,
                    timeout=30000.0
                )

                # 응답 확인
                if response.status_code in [200, 201, 202]:
                    logger.info(f"Successfully sent completion notification, status: {response.status_code}")
                    return True
                else:
                    logger.error(f"Failed to send completion notification: {response.status_code} {response.text}")
                    return False

        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            logger.error(f"Exception sending completion notification: {e}\n{error_traceback}")
            return False

    async def send_photo_completion_notification(
            self,
            result: List[PhotoProcessingResult],
            original_task_id: Optional[str] = None
    ):
        """사진 처리 완료 알림 전송"""
        try:
            if not result or len(result) == 0:
                logger.warning("사진 처리 결과가 없습니다.")
                return False

            member_id = result[0].memberId
            # 외부에서 전달받은 task_id가 있으면 우선 사용
            task_id = original_task_id or getattr(result[0], 'message_id', 'unknown_task')

            # 디버깅 로그 추가
            logger.info(f"Using task_id: {task_id} for photo notification")

            # 성공/실패 배열 분리
            success_items = []
            fail_items = []

            for item in result:
                if item.processing_status == "SUCCESS":
                    success_items.append(item.closetClothesId)
                else:
                    fail_items.append(item.closetClothesId)

            # 요청 데이터 구성
            request_data = {
                "memberId": member_id,
                "taskId": task_id,
                "successClosetClothes": success_items,
                "failClosetClothes": fail_items
            }

            logger.info(f"Sending photo completion notification: memberId={member_id}, success={len(success_items)}, fail={len(fail_items)}")

            # 서버에 전송
            logger.info(f"Sending request to {self.photo_completion_api_url} with data: {request_data}")
            async with httpx.AsyncClient(timeout=30000.0) as client:
                response = await client.post(
                    self.photo_completion_api_url,
                    json=request_data,
                    timeout=30000.0
                )

                # 응답 확인
                if response.status_code in [200, 201, 202]:
                    logger.info(f"Successfully sent photo completion notification, status: {response.status_code}")
                    return True
                else:
                    logger.error(f"Failed to send photo completion notification: {response.status_code} {response.text}")
                    return False

        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            logger.error(f"Exception sending photo completion notification: {e}\n{error_traceback}")
            return False