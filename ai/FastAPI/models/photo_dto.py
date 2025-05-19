from pydantic import BaseModel
from typing import Optional, List

class PhotoItem(BaseModel):
    closetClothesId: int
    s3Url: str
    categoryId: int

class PhotoRequest(BaseModel):
    taskId: str
    memberId: int
    items: List[PhotoItem]

class PhotoProcessingResult(BaseModel):
    memberId: int
    closetClothesId: int
    category_id: int
    image_url: str
    processing_status: str
    message_id: Optional[str] = None