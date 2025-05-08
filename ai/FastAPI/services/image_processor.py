import os
import uuid
import logging
import numpy as np
import cv2
from PIL import Image
import requests
from io import BytesIO
from rembg import remove
from ultralytics import YOLO
from openai import OpenAI

from config import OPENAI_API_KEY

logger = logging.getLogger(__name__)

class ImageProcessor:
    def __init__(self):
        self._init_models()

    def _init_models(self):
        # Initialize YOLOv8 for person detection
        try:
            logger.info("Initializing YOLOv8 model...")
            self.yolo_model = YOLO("yolov8n.pt")
        except Exception as e:
            logger.error(f"Failed to initialize YOLOv8 model: {e}")
            self.yolo_model = None

        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=OPENAI_API_KEY)

    def _download_image(self, image_url):
        """Download image from URL to bytes"""
        response = requests.get(image_url)
        response.raise_for_status()
        return BytesIO(response.content), Image.open(BytesIO(response.content)).convert('RGB')

    def has_person(self, image):
        """Check if image contains a person using YOLOv8"""
        if self.yolo_model is None:
            logger.warning("YOLOv8 model not initialized, cannot detect person")
            return False

        try:
            # Run detection
            results = self.yolo_model(image)

            # Check if person detected with confidence > 0.5
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    cls = int(box.cls.item())
                    conf = box.conf.item()
                    # Class 0 is 'person' in COCO dataset
                    if cls == 0 and conf > 0.5:
                        return True

            return False
        except Exception as e:
            logger.error(f"Error in person detection: {e}")
            return False

    def has_uniform_background(self, image):
        """Check if image has a uniform/studio background"""
        try:
            # Convert PIL image to OpenCV format
            img_cv = np.array(image)
            img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2BGR)

            # Blur the image to reduce noise
            blurred = cv2.GaussianBlur(img_cv, (21, 21), 0)

            # Split into RGB channels
            b, g, r = cv2.split(blurred)

            # Calculate standard deviation for each channel in border region
            h, w = img_cv.shape[:2]
            border = max(h, w) // 10  # Use 10% of the image size as border width

            # Create border mask
            mask = np.zeros((h, w), dtype=np.uint8)
            mask[border:-border, border:-border] = 0
            mask[:border, :] = 255
            mask[-border:, :] = 255
            mask[:, :border] = 255
            mask[:, -border:] = 255

            # Calculate standard deviation in border
            std_r = np.std(r[mask > 0])
            std_g = np.std(g[mask > 0])
            std_b = np.std(b[mask > 0])

            # If the std dev is low, it's likely a uniform background
            avg_std = (std_r + std_g + std_b) / 3
            return avg_std < 30  # Threshold determined empirically

        except Exception as e:
            logger.error(f"Error checking background uniformity: {e}")
            return False

    def is_product_only_image(self, image):
        """Determine if image is a product-only image (no person, uniform background)"""
        return not self.has_person(image) and self.has_uniform_background(image)

    def remove_background(self, image_bytes):
        """Remove background from image using rembg"""
        try:
            # Remove background
            result = remove(image_bytes.getvalue())
            return BytesIO(result)
        except Exception as e:
            logger.error(f"Failed to remove background: {e}")
            return image_bytes

    def generate_product_image(self, image_url, category_name):
        """Generate product-only image using GPT-4o"""
        try:
            # Download the original image first
            response = requests.get(image_url)
            response.raise_for_status()
            image_data = BytesIO(response.content)

            # Create prompt for GPT-4o
            prompt = f"이 이미지에서 {category_name}를 분리해서 상품 이미지를 생성하고 이 이미지를 읽고 분리한 상품이미지를 생성, 상품 외 배경은 투명처리"

            # Call OpenAI API - Using DALL-E 3 instead since GPT-4o doesn't support image generation
            response = self.openai_client.images.generate(
                model="dall-e-3",
                prompt=f"A clean product-only image of {category_name} clothing on a transparent background, professional product photography, no human model, studio lighting",
                n=1,
                size="1024x1024",
                response_format="b64_json"
            )

            # Get the generated image
            import base64
            image_data = base64.b64decode(response.data[0].b64_json)
            return BytesIO(image_data)

        except Exception as e:
            logger.error(f"Failed to generate product image: {e}")
            return None

    def process_image(self, image_urls, category_name):
        """Process images to get a background-removed product image"""
        if not image_urls:
            logger.warning("No image URLs provided")
            return None

        # Try to find a product-only image first
        for url in image_urls:
            try:
                image_bytes, pil_image = self._download_image(url)

                # Check if it's a product-only image
                if self.is_product_only_image(pil_image):
                    # Remove background and return
                    logger.info(f"Found product-only image: {url}")
                    return self.remove_background(image_bytes)
            except Exception as e:
                logger.warning(f"Error processing image {url}: {e}")
                continue

        logger.info("No product-only images found, trying to process model-worn images")

        # If no product-only image found, try to generate one
        for url in image_urls:
            try:
                # Generate product image using AI
                generated_image = self.generate_product_image(url, category_name)
                if generated_image:
                    logger.info(f"Successfully generated product image from {url}")
                    return generated_image
            except Exception as e:
                logger.warning(f"Error generating product image from {url}: {e}")
                continue

        # If all else fails, just take the first image and remove background
        try:
            logger.warning("Falling back to first image with background removal")
            image_bytes, _ = self._download_image(image_urls[0])
            return self.remove_background(image_bytes)
        except Exception as e:
            logger.error(f"Failed to process any images: {e}")
            return None