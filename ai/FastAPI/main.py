import os
import uvicorn
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio
from app.config import settings
from app.services.sqs_service import SQSService
from app.services.image_processor import ImageProcessor
from app.services.db_service import DBService
from app.worker import process_message

# ngrok 통합 추가
try:
    from scripts.start_ngrok import start_ngrok
except ImportError:
    start_ngrok = None

app = FastAPI(title="Clothes Image Processor")

# SQS 서비스 초기화
sqs_service = SQSService(
    aws_access_key=settings.AWS_ACCESS_KEY,
    aws_secret_key=settings.AWS_SECRET_KEY,
    region_name=settings.AWS_REGION,
    queue_url=settings.SQS_QUEUE_URL
)

# DB 서비스 초기화
db_service = DBService(
    host=settings.DB_HOST,
    user=settings.DB_USER,
    password=settings.DB_PASSWORD,
    database=settings.DB_NAME,
    port=settings.DB_PORT
)

# 이미지 프로세서 초기화
image_processor = ImageProcessor(
    openai_api_key=settings.OPENAI_API_KEY,
    s3_access_key=settings.AWS_ACCESS_KEY,
    s3_secret_key=settings.AWS_SECRET_KEY,
    s3_region=settings.AWS_REGION,
    s3_bucket=settings.S3_BUCKET
)

class ClothesItem(BaseModel):
    clothesId: int
    linkUrl: str

class ProcessRequest(BaseModel):
    memberId: int
    fcmToken: str
    items: List[ClothesItem]

@app.post("/api/clothes/process")
async def process_clothes(request: ProcessRequest, background_tasks: BackgroundTasks):
    """의류 이미지 처리 요청을 SQS 큐에 전송"""
    try:
        # 요청 데이터를 SQS에 전송
        message_id = await sqs_service.send_message(request.dict())
        return {"status": "processing", "message_id": message_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to enqueue request: {str(e)}")

@app.get("/api/health")
async def health_check():
    """서버 상태 확인 엔드포인트"""
    return {"status": "healthy"}

# 비동기 워커 시작
worker_task = None

@app.on_event("startup")
async def startup_event():
    global worker_task
    # ngrok 시작 (개발 환경에서만)
    if os.environ.get("ENV") == "development" and start_ngrok:
        public_url = start_ngrok()
        if public_url:
            print(f"ngrok 공개 URL: {public_url}")

    # 워커 시작
    worker_task = asyncio.create_task(process_messages_worker())

async def process_messages_worker():
    """SQS에서 메시지를 가져와 처리하는 워커"""
    while True:
        try:
            messages = await sqs_service.receive_messages(max_messages=5)
            if messages:
                for message in messages:
                    await process_message(
                        message=message,
                        sqs_service=sqs_service,
                        image_processor=image_processor,
                        db_service=db_service
                    )
            else:
                # 메시지가 없으면 잠시 대기
                await asyncio.sleep(1)
        except Exception as e:
            print(f"Error in worker: {str(e)}")
            await asyncio.sleep(5)  # 오류 발생 시 잠시 대기

@app.on_event("shutdown")
async def shutdown_event():
    if worker_task:
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            pass

if __name__ == "__main__":
    # 환경 변수 설정
    os.environ["ENV"] = os.environ.get("ENV", "development")

    # 서버 실행
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )