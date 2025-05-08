import asyncio
import logging
import uvicorn
from fastapi import FastAPI, BackgroundTasks
from contextlib import asynccontextmanager
from pyngrok import ngrok
import os

from config import WORKER_CONCURRENCY
from models.db_models import init_db
from services.sqs_service import SQSService
from services.product_processor import ProductProcessor
from services.purchase_processor import PurchaseProcessor
from services.notification_service import NotificationService
from models.purchase_dto import PurchaseItem

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Initialize services
sqs_service = SQSService()
notification_service = NotificationService()

# Queue for worker tasks
message_queue = asyncio.Queue()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    init_db()

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

    # 여기에 ngrok 관련 코드가 있었으나 이미 삭제되었습니다.
    # 완전히 삭제되었는지 코드 검토 필요

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
            # Poll for messages
            messages = sqs_service.receive_messages(max_messages=WORKER_CONCURRENCY)

            if messages:
                logger.info(f"Received {len(messages)} messages from SQS")

                # Add messages to queue
                for message in messages:
                    parsed_message = sqs_service.parse_message(message)
                    if parsed_message:
                        logger.info(f"Parsed message type: {parsed_message['message_type']}")
                        await message_queue.put((parsed_message, message['ReceiptHandle']))

            # Wait a bit before polling again if no messages
            if not messages:
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

            # Determine message type and process accordingly
            if message_data['message_type'] == 'purchase':
                # Process purchase history
                purchase_data = message_data['data']
                member_id = purchase_data['memberId']
                items = [PurchaseItem(clothesId=item['clothesId'], linkUrl=item['linkUrl'])
                         for item in purchase_data['items']]

                logger.info(f"Processing purchase for member {member_id} with {len(items)} items")

                # Process purchase items
                processor = PurchaseProcessor()
                results = await processor.process_purchase(
                    member_id=member_id,
                    items=items,
                    message_id=message_data['message_id']
                )

                # Send completion notification for all processed items
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

            if notification_success:
                # Delete message from SQS only if notification was successful
                sqs_service.delete_message(receipt_handle)
                logger.info(f"Worker {worker_id} completed message: {message_data['message_id']}")
            else:
                logger.warning(f"Worker {worker_id} could not send notification for message: {message_data['message_id']}")

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