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
            # Check if it's a single result or a list of results
            if isinstance(result, list):
                # For purchase processing, send all results in one notification
                results_dict = {"results": [r.model_dump() for r in result]}
                logger.info(f"Sending batch completion notification for {len(result)} items")
            else:
                # For single product processing
                results_dict = result.model_dump()

            # Send notification
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.completion_api_url,
                    json=results_dict,
                    timeout=10.0
                )

                # Check response
                if response.status_code in [200, 201, 202]:
                    message_id = result[0].message_id if isinstance(result, list) else result.message_id
                    logger.info(f"Successfully sent completion notification for message ID: {message_id}")
                    return True
                else:
                    logger.error(f"Failed to send completion notification: {response.status_code} {response.text}")
                    return False

        except Exception as e:
            logger.error(f"Exception sending completion notification: {e}")
            return False