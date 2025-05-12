from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class PurchaseItem(BaseModel):
    clothesId: int
    linkUrl: str

class PurchaseRequest(BaseModel):
    memberId: int
    fcmToken: str
    items: List[PurchaseItem]

class PurchaseProcessingResult(BaseModel):
    memberId: int
    clothesId: int
    category_id: int
    category_name: str
    color_id: int
    color_name: str
    color_hex: str
    image_url: str
    processing_status: str
    message_id: Optional[str] = None