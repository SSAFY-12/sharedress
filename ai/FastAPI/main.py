import asyncio
import logging
import uvicorn
from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
from pyngrok import ngrok
import os

from config import WORKER_CONCURRENCY, SQS_QUEUE_URL, PHOTO_SQS_QUEUE_URL
from services.sqs_service import SQSService
from services.product_processor import ProductProcessor
from services.purchase_processor import PurchaseProcessor
from services.photo_processor import PhotoProcessor
from services.notification_service import NotificationService
from models.purchase_dto import PurchaseItem
from models.photo_dto import PhotoItem

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Initialize services
sqs_service = SQSService()
notification_service = NotificationService()

# 사진 전용 SQS 서비스 초기화
photo_sqs_service = SQSService()
photo_sqs_service.queue_url = PHOTO_SQS_QUEUE_URL

# Queue for worker tasks
message_queue = asyncio.Queue()

# Task tracking dict - keeps track of results for each taskId
task_results = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database

    # 외부 ngrok URL 로그 표시
    ngrok_url = os.environ.get("NGROK_URL", "https://sharedress-ai.ngrok.io")
    logger.info(f"Using external ngrok URL: {ngrok_url}")

    # Start worker tasks
    worker_tasks = []
    for i in range(WORKER_CONCURRENCY):
        task = asyncio.create_task(message_worker(i))
        worker_tasks.append(task)

    # Start SQS poller
    sqs_poller_task = asyncio.create_task(sqs_poller())

    yield

    # Cleanup
    logger.info("Shutting down...")

    # Cancel worker tasks
    for task in worker_tasks:
        task.cancel()

    # Cancel SQS poller
    sqs_poller_task.cancel()


app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    """Root endpoint - basic health check"""
    return {"status": "online", "message": "AI Product Processor is running"}

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

async def sqs_poller():
    """Poll SQS for messages and add them to the processing queue"""
    logger.info("Starting SQS poller...")

    while True:
        try:
            # 일반 SQS 폴링
            messages = sqs_service.receive_messages(max_messages=WORKER_CONCURRENCY)

            if messages:
                logger.info(f"Received {len(messages)} messages from SQS")

                # Add messages to queue
                for message in messages:
                    parsed_message = sqs_service.parse_message(message)
                    if parsed_message:
                        logger.info(f"Parsed message type: {parsed_message['message_type']}")
                        await message_queue.put((parsed_message, message['ReceiptHandle']))

            # 사진 SQS 폴링 (새로 추가)
            photo_messages = photo_sqs_service.receive_messages(max_messages=WORKER_CONCURRENCY)

            if photo_messages:
                logger.info(f"Received {len(photo_messages)} photo messages from SQS")

                # 메시지 큐에 추가
                for message in photo_messages:
                    parsed_message = photo_sqs_service.parse_message(message)
                    if parsed_message:
                        logger.info(f"Parsed photo message: {parsed_message['message_type']}")
                        await message_queue.put((parsed_message, message['ReceiptHandle']))

            # Wait a bit before polling again if no messages
            if not messages and not photo_messages:
                await asyncio.sleep(5)

        except asyncio.CancelledError:
            logger.info("SQS poller was cancelled")
            break
        except Exception as e:
            logger.error(f"Error in SQS poller: {e}")
            await asyncio.sleep(5)  # Wait before retrying

async def message_worker(worker_id):
    """Worker to process messages from the queue"""
    logger.info(f"Starting worker {worker_id}")

    while True:
        try:
            # Get message from queue
            message_data, receipt_handle = await message_queue.get()

            logger.info(f"Worker {worker_id} processing message: {message_data['message_id']}")

            notification_success = False  # 기본값 설정

            # Determine message type and process accordingly
            if message_data['message_type'] == 'photo':
                # 사진 처리 로직
                photo_data = message_data['data']
                member_id = photo_data['memberId']
                task_id = photo_data['taskId']

                # 디버깅: 항목 정보 로깅
                logger.info(f"Photo data items before conversion: {photo_data['items']}")

                items = []
                for item_data in photo_data['items']:
                    # 각 항목을 로깅하고 변환
                    logger.info(f"Processing item: {item_data}")

                    # categoryId가 있는지 확인하고 기본값 설정
                    closet_clothes_id = item_data.get('closetClothesId')
                    s3_url = item_data.get('s3Url')
                    category_id = item_data.get('categoryId')

                    if category_id is None:
                        logger.warning(f"Missing categoryId for item {closet_clothes_id}, using default value 1")
                        category_id = 1  # 없으면 기본값 1(상의)

                    item = PhotoItem(
                        closetClothesId=closet_clothes_id,
                        s3Url=s3_url,
                        categoryId=category_id
                    )
                    items.append(item)
                    logger.info(f"Created PhotoItem: closetClothesId={item.closetClothesId}, categoryId={item.categoryId}")

                # 사진 처리
                processor = PhotoProcessor()
                results = await processor.process_photo(
                    member_id=member_id,
                    items=items,
                    message_id=task_id
                )

                # 알림 전송 로직 추가
                try:
                    notification_success = await notification_service.send_completion_notification(results, task_id)
                    logger.info(f"Sent photo completion notification for task {task_id} ({len(results)} items)")
                except Exception as e:
                    logger.error(f"Failed to send photo notification: {e}")
                    notification_success = False  # 에러 발생 시 실패로 처리

            elif message_data['message_type'] == 'purchase':
                # Process purchase history
                purchase_data = message_data['data']
                member_id = purchase_data['memberId']
                items = [PurchaseItem(clothesId=item['clothesId'], linkUrl=item['linkUrl'])
                         for item in purchase_data['items']]

                # 새로운 필드 추출
                task_id = purchase_data.get('taskId', '')
                is_last = purchase_data.get('isLast', True)

                logger.info(f"Processing purchase for member {member_id} with {len(items)} items (taskId: {task_id}, isLast: {is_last})")

                # Process purchase items - task_id를 message_id로 전달
                processor = PurchaseProcessor()
                results = await processor.process_purchase(
                    member_id=member_id,
                    items=items,
                    message_id=task_id  # 변경: message_id 대신 task_id 전달
                )

                # taskId가 있는 경우의 처리 로직 추가
                if task_id:
                    if task_id not in task_results:
                        task_results[task_id] = []
                    task_results[task_id].extend(results)

                    # isLast가 true인 경우에만 알림 전송
                    if is_last:
                        all_results = task_results[task_id]
                        # task_id 직접 전달
                        notification_success = await notification_service.send_completion_notification(all_results, task_id)
                        logger.info(f"Sent completion notification for task {task_id} ({len(all_results)} items)")

                        # 작업 완료 후 결과 정리
                        del task_results[task_id]
                    else:
                        logger.info(f"Skipping notification for task {task_id} (not last message)")
                        notification_success = True  # 아직 알림을 보내지 않지만 성공으로 처리
                else:
                    # taskId가 없는 경우 기존 방식대로 처리
                    notification_success = await notification_service.send_completion_notification(results)

            else:
                # Process standard product URL request
                product_data = message_data['data']
                processor = ProductProcessor()
                result = await processor.process_product(
                    product_data['url'],
                    product_data['desired_color'],
                    message_data['message_id']
                )

                # Send completion notification
                notification_success = await notification_service.send_completion_notification(result)

            # SQS에서 메시지 삭제
            try:
                if message_data['message_type'] == 'photo':
                    photo_sqs_service.delete_message(receipt_handle)
                else:
                    sqs_service.delete_message(receipt_handle)

                if notification_success:
                    logger.info(f"Worker {worker_id} completed message: {message_data['message_id']}")
                else:
                    logger.warning(f"Worker {worker_id} could not send notification for message: {message_data['message_id']}, but message has been deleted from queue")
            except Exception as e:
                logger.error(f"Failed to delete message {message_data['message_id']}: {str(e)}")

            # Mark task as done
            message_queue.task_done()

        except asyncio.CancelledError:
            logger.info(f"Worker {worker_id} was cancelled")
            break
        except Exception as e:
            logger.error(f"Error in worker {worker_id}: {e}")
            # Mark task as done even if there was an error
            message_queue.task_done()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)