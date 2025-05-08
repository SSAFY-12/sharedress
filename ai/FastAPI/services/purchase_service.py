import logging
import asyncio
from typing import List, Dict, Any

from services.product_processor import ProductProcessor
from models.purchase_dto import PurchaseItem, PurchaseProcessingResult

logger = logging.getLogger(__name__)

class PurchaseProcessor:
    def __init__(self):
        """Initialize purchase processor"""
        self.product_processor = ProductProcessor()

    async def process_purchase(self, member_id: int, items: List[PurchaseItem], message_id: str = None) -> List[PurchaseProcessingResult]:
        """Process purchase items and extract product information from URLs"""
        results = []

        for item in items:
            try:
                logger.info(f"Processing purchase item: clothesId={item.clothesId}, linkUrl={item.linkUrl}")

                # Process the product URL using the existing product processor
                product_result = await self.product_processor.process_product(
                    url=item.linkUrl,
                    desired_color=None,  # No specific color requested for purchases
                    message_id=message_id
                )

                # Create a purchase processing result
                purchase_result = PurchaseProcessingResult(
                    memberId=member_id,
                    clothesId=item.clothesId,
                    category_id=product_result.category_id,
                    category_name=product_result.category_name,
                    color_id=product_result.color_id,
                    color_name=product_result.color_name,
                    color_hex=product_result.color_hex,
                    image_uri=product_result.image_uri,
                    processing_status=product_result.processing_status,
                    message_id=message_id
                )

                results.append(purchase_result)
                logger.info(f"Successfully processed purchase item: clothesId={item.clothesId}")

            except Exception as e:
                logger.error(f"Error processing purchase item {item.clothesId}: {e}")
                # Add error result
                error_result = PurchaseProcessingResult(
                    memberId=member_id,
                    clothesId=item.clothesId,
                    category_id=1,  # Default to tops
                    category_name="상의",
                    color_id=1,  # Default to black warm
                    color_name="블랙 웜",
                    color_hex="#000000",
                    image_uri="",
                    processing_status="ERROR",
                    message_id=message_id
                )
                results.append(error_result)

        return results