import logging
from typing import List, Optional

from services.product_processor import ProductProcessor
from models.purchase_dto        import PurchaseItem, PurchaseProcessingResult

logger = logging.getLogger(__name__)


class PurchaseProcessor:
    """여러 상품 URL 을 순차 처리하는 상위 Processor"""

    def __init__(self):
        self.product_processor = ProductProcessor()

    # ───────────────────────────────────────────
    async def process_purchase(
            self,
            member_id: int,
            items: List[PurchaseItem],
            message_id: Optional[str] = None,
    ) -> List[PurchaseProcessingResult]:

        results: List[PurchaseProcessingResult] = []

        for item in items:
            try:
                logger.info("Processing purchase: clothesId=%s", item.clothesId)
                prod = await self.product_processor.process_product(
                    url=item.linkUrl,
                    desired_color=None,
                    message_id=message_id,
                )
                results.append(
                    PurchaseProcessingResult(
                        memberId      = member_id,
                        clothesId     = item.clothesId,
                        category_id   = prod.category_id,
                        category_name = prod.category_name,
                        color_id      = prod.color_id,
                        color_name    = prod.color_name,
                        color_hex     = prod.color_hex,
                        image_uri     = prod.image_uri,
                        processing_status = prod.processing_status,
                        message_id    = message_id,
                    )
                )
                logger.info("✓ clothesId %s done", item.clothesId)

            except Exception as e:
                logger.error("× clothesId %s error: %s", item.clothesId, e)
                results.append(
                    PurchaseProcessingResult(
                        memberId=member_id, clothesId=item.clothesId,
                        category_id=1, category_name="상의",
                        color_id=1, color_name="블랙 웜", color_hex="#000000",
                        image_uri="", processing_status="ERROR",
                        message_id=message_id
                    )
                )

        return results
