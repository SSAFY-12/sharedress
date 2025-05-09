# services/image_processor.py
import base64
import logging
from io import BytesIO
from typing import List, Tuple

import aiohttp
import cv2
import numpy as np
import requests
import torch
import torch.serialization as ts
from PIL import Image
from openai import OpenAI
from rembg import remove
from ultralytics import YOLO

from config import OPENAI_API_KEY

logger = logging.getLogger(__name__)


class ImageProcessor:
    """이미지 다운로드 → 모델 컷 필터링 → 배경 제거 → 필요 시 DALL·E 생성"""

    # ------------------------------------------------------------------ #
    # 초기화
    # ------------------------------------------------------------------ #
    def __init__(self) -> None:
        self._init_models()

    def _init_models(self) -> None:
        # ----------------------------------
        # 1) YOLOv8 - person detection
        # ----------------------------------
        try:
            logger.info("Initializing YOLOv8 …")

            # PyTorch ≥2.6 : weights_only=True 가 기본 → 전체 로드 강제
            ts.add_safe_globals(
                [("ultralytics.nn.tasks.DetectionModel", "ultralytics.nn.tasks.DetectionModel")]
            )
            self.yolo_model = YOLO("yolov8n.pt", weights_only=False).to(
                "cuda" if torch.cuda.is_available() else "cpu"
            )

        except Exception as e:
            logger.error(f"Failed to initialize YOLOv8: {e}")
            self.yolo_model = None

        # ----------------------------------
        # 2) OpenAI 이미지 생성
        # ----------------------------------
        self.openai_client = OpenAI(api_key=OPENAI_API_KEY)

    # ------------------------------------------------------------------ #
    # 내부 유틸
    # ------------------------------------------------------------------ #
    @staticmethod
    def _download_image(image_url: str) -> Tuple[BytesIO, Image.Image]:
        resp = requests.get(image_url, timeout=10)
        resp.raise_for_status()
        buf = BytesIO(resp.content)
        return buf, Image.open(buf).convert("RGB")

    # ---------------------------------- #
    # YOLO person detection
    # ---------------------------------- #
    def has_person(self, pil_img: Image.Image) -> bool:
        if self.yolo_model is None:
            logger.warning("YOLOv8 model not initialized.")
            return False

        try:
            results = self.yolo_model.predict(
                pil_img,
                device=0 if torch.cuda.is_available() else "cpu",
                verbose=False,
            )
            for res in results:
                for box in res.boxes:
                    cls = int(box.cls.item())
                    conf = float(box.conf.item())
                    if cls == 0 and conf > 0.5:  # 0 == person
                        return True
            return False
        except Exception as e:
            logger.error(f"YOLO person detection error: {e}")
            return False

    # ---------------------------------- #
    # 배경 균일도 체크
    # ---------------------------------- #
    @staticmethod
    def has_uniform_background(pil_img: Image.Image) -> bool:
        try:
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            blr = cv2.GaussianBlur(img, (21, 21), 0)

            b, g, r = cv2.split(blr)
            h, w = img.shape[:2]
            border = max(h, w) // 10
            mask = np.zeros((h, w), np.uint8)
            mask[:border, :] = 255
            mask[-border:, :] = 255
            mask[:, :border] = 255
            mask[:, -border:] = 255

            std = np.mean([np.std(c[mask > 0]) for c in (r, g, b)])
            return std < 30
        except Exception as e:
            logger.error(f"Uniform-background check failed: {e}")
            return False

    # ---------------------------------- #
    # rembg 배경제거
    # ---------------------------------- #
    @staticmethod
    def remove_background(buf: BytesIO) -> BytesIO:
        try:
            output = remove(buf.getvalue())
            return BytesIO(output)
        except Exception as e:
            logger.error(f"rembg background removal failed: {e}")
            return buf

    # ---------------------------------- #
    # DALL·E 3 이미지 생성
    # ---------------------------------- #
    def generate_product_image(self, image_url: str, category_name: str) -> BytesIO | None:
        try:
            prompt = (
                f"{category_name} 의류만 깔끔하게 잘린 PNG, 투명 배경, "
                "studio product shot, no model, high-res"
            )
            resp = self.openai_client.images.generate(
                model="GPT-image-1",
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="b64_json",
            )
            img_bytes = base64.b64decode(resp.data[0].b64_json)
            return BytesIO(img_bytes)
        except Exception as e:
            logger.error(f"DALL·E image generation failed: {e}")
            return None

    # ------------------------------------------------------------------ #
    # 공개 메서드: 이미지 리스트 처리
    # ------------------------------------------------------------------ #
    def process_image(self, image_urls: List[str], category_name: str) -> BytesIO | None:
        if not image_urls:
            logger.warning("No image URLs supplied.")
            return None

        # 1-A. 제품 단독 컷 찾기
        for url in image_urls:
            try:
                buf, pil_img = self._download_image(url)
                if not self.has_person(pil_img) and self.has_uniform_background(pil_img):
                    logger.info(f"Product-only image found: {url}")
                    return self.remove_background(buf)
            except Exception as e:
                logger.warning(f"Image check failed ({url}): {e}")

        # 1-B. 모델 착용 컷 → DALL·E 생성
        for url in image_urls:
            gen = self.generate_product_image(url, category_name)
            if gen:
                logger.info(f"DALL·E succeeded for {url}")
                return gen

        # 1-C. 최후: 첫 번째 이미지를 강제 배경제거
        try:
            buf, _ = self._download_image(image_urls[0])
            logger.warning("Fallback to first image + background removal.")
            return self.remove_background(buf)
        except Exception as e:
            logger.error(f"Ultimate fallback failed: {e}")
            return None
