from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class ProductRequest(BaseModel):
    url: HttpUrl
    desired_color: Optional[str] = None

class ProductProcessingResult(BaseModel):
    url: str
    product_name: str
    category_id: int
    category_name: str
    color_id: int
    color_name: str
    color_hex: str
    image_uri: str
    processing_status: str
    message_id: Optional[str] = None