import base64, logging, requests, cv2, numpy as np, torch
from io import BytesIO
from typing import List, Tuple

import torch.serialization as ts
from PIL import Image
from openai import OpenAI
from rembg import remove
from ultralytics import YOLO
import open_clip

from config import OPENAI_API_KEY

logger = logging.getLogger(__name__)


class ImageProcessor:
    """URL 리스트 → '사람 없는' 상품컷 선별 → rembg →(없으면) DALL·E 3 생성"""

    def __init__(self) -> None:
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        # YOLO ‒ person
        try:
            logger.info("Initializing YOLOv8 …")
            ts.add_safe_globals(
                [("ultralytics.nn.tasks.DetectionModel",
                  "ultralytics.nn.tasks.DetectionModel")]
            )
            self.yolo = YOLO("yolov8n.pt")
            self.yolo.model.to(self.device)
        except Exception as e:
            logger.error("YOLO init failed: %s", e)
            self.yolo = None

        # OpenAI (DALL·E3)
        self.openai = OpenAI(api_key=OPENAI_API_KEY)

        # Fashion-CLIP
        try:
            m = "hf-hub:Marqo/marqo-fashionCLIP"
            self.clip, _, self.clip_pp = open_clip.create_model_and_transforms(m)
            self.clip = self.clip.to(self.device).eval()
            tok = open_clip.get_tokenizer(m)
            with torch.no_grad():
                t = tok(["studio product photo of clothing", "model wearing clothing"])
                t = t.to(self.device)  # 텍스트 토큰을 디바이스로 이동
                vec = self.clip.encode_text(t)
                vec = vec / vec.norm(dim=-1, keepdim=True)
                self.txt_prod = vec[0].to(self.device)
                self.txt_wear = vec[1].to(self.device)
            logger.info("CLIP ready")
        except Exception as e:
            logger.error("CLIP init failed: %s", e)
            # GPU 문제 시 CPU로 전환
            self.device = "cpu"
            # CPU 모드로 다시 초기화
            m = "hf-hub:Marqo/marqo-fashionCLIP"
            self.clip, _, self.clip_pp = open_clip.create_model_and_transforms(m)
            self.clip = self.clip.to(self.device).eval()
            tok = open_clip.get_tokenizer(m)
            with torch.no_grad():
                t = tok(["studio product photo of clothing", "model wearing clothing"])
                t = t.to(self.device)
                vec = self.clip.encode_text(t)
                vec = vec / vec.norm(dim=-1, keepdim=True)
                self.txt_prod = vec[0].to(self.device)
                self.txt_wear = vec[1].to(self.device)
            logger.info("CLIP ready (CPU mode)")

    @staticmethod
    def _download(url: str) -> Tuple[BytesIO, Image.Image]:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        buf = BytesIO(r.content)
        return buf, Image.open(buf).convert("RGB")

    def _has_person(self, img: Image.Image) -> bool:
        if not self.yolo:
            return False
        out = self.yolo.predict(img,
                                device=0 if self.device == "cuda" else "cpu",
                                verbose=False)
        return any(int(b.cls) == 0 and float(b.conf) > .45
                   for r in out for b in r.boxes)

    def _product_score(self, img: Image.Image) -> float:
        with torch.no_grad():
            tensor_img = self.clip_pp(img).unsqueeze(0).to(self.device)
            v = self.clip.encode_image(tensor_img)
            v = v / v.norm(dim=-1, keepdim=True)
        # 모든 텐서가 같은 디바이스에 있는지 확인
        prod_score = (v @ self.txt_prod.T).item()
        wear_score = (v @ self.txt_wear.T).item()
        return prod_score - wear_score

    @staticmethod
    def remove_background(buf: BytesIO) -> BytesIO:
        try:
            return BytesIO(remove(buf.getvalue()))
        except Exception as e:
            logger.error("rembg error: %s", e)
            return buf

    def _generate(self, category: str) -> BytesIO | None:
        try:
            prompt = (f"{category} clothing isolated on transparent background, "
                      "studio product photo, no human, high-res")
            r = self.openai.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                n=1,
                size="1024x1024"
            )

            # URL에서 이미지 다운로드 (최신 API는 base64 대신 URL 반환)
            img_url = r.data[0].url
            response = requests.get(img_url)
            response.raise_for_status()
            return BytesIO(response.content)
        except Exception as e:
            logger.error("OpenAI gen error: %s", e)
            return None
    # product_processor.py에서 호출하는 메서드
    def generate_product_image(self, _, category: str) -> BytesIO | None:
        return self._generate(category)

    def process_image(self, urls: List[str], category: str) -> BytesIO | None:
        """사람 없는 컷을 **무조건** 우선 사용"""
        if not urls:
            return None

        # ① 후보 수집: '사람 없는' 이미지 전부
        no_person: list[Tuple[BytesIO, Image.Image, float]] = []
        for u in urls:
            try:
                buf, img = self._download(u)
                if not self._has_person(img):
                    score = self._product_score(img)
                    no_person.append((buf, img, score))
            except Exception as e:
                logger.warning("DL fail %s: %s", u, e)

        # ② 가장 product-like 높은 점수 선택
        if no_person:
            buf, _, _ = max(no_person, key=lambda x: x[2])
            return self.remove_background(buf)

        # ③ 없으면 DALL·E3
        gen = self._generate(category)
        if gen:
            return gen

        # ④ 최후: 첫 번째 이미지 rembg
        try:
            buf, _ = self._download(urls[0])
            return self.remove_background(buf)
        except Exception as e:
            logger.error("Ultimate fallback error: %s", e)
            return None