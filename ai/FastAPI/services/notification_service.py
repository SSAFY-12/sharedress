import json
import logging
import httpx
from typing import Union, List

from config import COMPLETION_API_URL
from models.dto import ProductProcessingResult
from models.purchase_dto import PurchaseProcessingResult

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        """Initialize notification service"""
        self.completion_api_url = COMPLETION_API_URL

    async def send_completion_notification(self, result: Union[ProductProcessingResult, List[PurchaseProcessingResult]]):
        """Send completion notification to the backend server"""
        try:
            # 요청 데이터 구성 변경
            if isinstance(result, list) and len(result) > 0:
                # 배치 처리 (구매 처리)
                member_id = result[0].memberId

                # 성공/실패 배열 분리
                success_clothes = []
                fail_clothes = []

                for item in result:
                    if item.processing_status == "SUCCESS":
                        success_clothes.append(item.clothesId)
                    else:
                        fail_clothes.append(item.clothesId)

                # 새로운 요청 형식 구성
                request_data = {
                    "memberId": member_id,
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

                    if result.processing_status == "SUCCESS":
                        success_clothes = [1]  # 단일 상품의 경우 의미 있는 ID가 없으므로 임의로 1 설정
                        fail_clothes = []
                    else:
                        success_clothes = []
                        fail_clothes = [1]  # 단일 상품의 경우 의미 있는 ID가 없으므로 임의로 1 설정

                    request_data = {
                        "memberId": member_id,
                        "successClothes": success_clothes,
                        "failClothes": fail_clothes
                    }
                else:
                    # 결과가 없는 경우 빈 데이터 전송
                    request_data = {
                        "memberId": 0,
                        "successClothes": [],
                        "failClothes": []
                    }

                logger.info(f"Sending single product completion notification")

            # 서버에 전송
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