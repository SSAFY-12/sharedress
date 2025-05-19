# services/category_classifier.py
import logging
from io import BytesIO
from typing import Tuple, Dict, List

import requests
import torch
import numpy as np
from PIL import Image
import open_clip
from transformers import AutoImageProcessor, ViTForImageClassification

logger = logging.getLogger(__name__)


class CategoryClassifier:
    """
    - 기본값(use_clip=True) : FashionCLIP(멀티모달) Zero-shot 분류
    - use_clip=False      : DeepFashion ViT 모델 분류
    두 모드 모두 (category_id, category_name) 튜플을 반환한다.
    """

    # ──────────────────────────────────────────
    # 1. 클래스 변수 – DB 매핑
    # ──────────────────────────────────────────
    _DEEPFASHION_TO_DB: Dict[str, int] = {
        # tops
        'T-Shirt': 1, 'Blouse': 1, 'Shirt': 1, 'Tank': 1, 'Top': 1, 'Vest': 1,
        'Sweater': 1, 'Sweatshirt': 1, 'Polo': 1, 'Jersey': 1, 'Hoodie': 1,
        # outer
        'Jacket': 2, 'Coat': 2, 'Blazer': 2, 'Cardigan': 2, 'Parka': 2,
        'Windbreaker': 2, 'Poncho': 2, 'Suit': 2,
        # bottoms
        'Jeans': 3, 'Shorts': 3, 'Pants': 3, 'Leggings': 3,
        'Joggers': 3, 'Trousers': 3, 'Sweatpants': 3,
        # shoes
        'Shoes': 4, 'Sneakers': 4, 'Boots': 4, 'Sandals': 4, 'Loafers': 4,
        'Flats': 4, 'Heels': 4, 'Slippers': 4,
        # etc → accessories
        'Bag': 5, 'Backpack': 5, 'Belt': 5, 'Wallet': 5, 'Hat': 5,
        'Scarf': 5, 'Sunglasses': 5, 'Watch': 5, 'Jewelry': 5,
        # 원피스/스커트 카테고리 추가
        'Dress': 6, 'Skirt': 6, 'One Piece': 6, 'Jumpsuit': 6, 'Romper': 6
    }

    _DB_CATEGORIES: Dict[int, str] = {
        1: "상의",
        2: "아우터",
        3: "하의",
        4: "신발",
        5: "악세사리",
        6: "원피스/스커트"  # 새 카테고리 추가
    }

    # ──────────────────────────────────────────
    # 2. 초기화
    # ──────────────────────────────────────────
    def __init__(self, use_clip: bool = True) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.use_clip = use_clip
        self.clip_model = None                    # type: ignore
        self.preprocess = None                    # type: ignore
        self.class_vectors: torch.Tensor | None = None

        if self.use_clip:
            self._init_clip()
        else:
            self._init_deepfashion()

    # ──────────────────────────────────────────
    # 3-A. FashionCLIP 초기화
    # ──────────────────────────────────────────
class CategoryClassifier:
    ...
    # ──────────────────────────────────────────
    # 3-A. FashionCLIP 초기화
    # ──────────────────────────────────────────
    def _init_clip(self) -> None:           # ← 클래스 안쪽(4칸)으로 들여쓰기
        try:
            logger.info("Initializing FashionCLIP…")
            model_name = "hf-hub:Marqo/marqo-fashionCLIP"

            # pretrained=None → HF 모델 카드의 기본 가중치 사용
            self.clip_model, _, self.preprocess = open_clip.create_model_and_transforms(
                model_name,  # pretrained 파라미터 제거
            )
            self.clip_model = self.clip_model.to(self.device).eval()
            self.clip_tokenizer = open_clip.get_tokenizer(model_name)

        except Exception as e:
            logger.warning(f"FashionCLIP 로드 실패, 기본 CLIP으로 대체: {e}")
            # ---- Fallback: ViT-B/32 (LAION2B) ----
            self.clip_model, _, self.preprocess = open_clip.create_model_and_transforms(
                "ViT-B-32", pretrained="laion2b_s34b_b79k"
            )
            self.clip_model = self.clip_model.to(self.device).eval()
            self.clip_tokenizer = open_clip.get_tokenizer("ViT-B-32")

        # 텍스트 임베딩 사전 계산
        prompts = [f"a photo of {t}" for t in
                   ["tops", "outerwear", "bottoms", "shoes", "accessories"]]
        with torch.no_grad():
            txt = self.clip_tokenizer(prompts).to(self.device)
            vec = self.clip_model.encode_text(txt)
            self.class_vectors = vec / vec.norm(dim=-1, keepdim=True)

        logger.info("CLIP ready.")

    # ──────────────────────────────────────────
    # 3-B. DeepFashion ViT 초기화
    # ──────────────────────────────────────────
    def _init_deepfashion(self) -> None:
        try:
            logger.info("Initializing DeepFashion ViT...")
            model_name = "adityavithaldas/Fashion_Category_Classifier"
            self.df_processor = AutoImageProcessor.from_pretrained(model_name)
            self.df_model = ViTForImageClassification.from_pretrained(model_name).to(self.device).eval()
            self.df_id2label: Dict[int, str] = self.df_model.config.id2label
            logger.info("DeepFashion ViT ready.")
        except Exception as e:
            logger.error(f"DeepFashion 초기화 실패: {e}")
            raise

    # ──────────────────────────────────────────
    # 4. 공개 API
    # ──────────────────────────────────────────
    def classify_url(self, image_url: str) -> Tuple[int, str]:
        """
        1) URL에서 이미지를 받아서
        2) 선택한 모델(CLIP / DeepFashion)로 분류
        3) (category_id, category_name) 반환
        실패 시 디폴트 (1, "상의") 반환
        """
        try:
            image = self._download_image(image_url)
            if self.use_clip:
                return self._classify_clip(image)
            return self._classify_deepfashion(image)
        except Exception as e:
            logger.error(f"[분류 실패] {image_url} → {e}")
            return 1, "상의"

    # ──────────────────────────────────────────
    # 5-A. CLIP 분류
    # ──────────────────────────────────────────
    def _classify_clip(self, image: Image.Image) -> Tuple[int, str]:
        if self.clip_model is None or self.class_vectors is None:
            raise RuntimeError("CLIP 모델이 초기화되지 않았습니다.")

        img_tensor = self.preprocess(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            img_vec = self.clip_model.encode_image(img_tensor)
            img_vec = img_vec / img_vec.norm(dim=-1, keepdim=True)
            sim = (100.0 * img_vec @ self.class_vectors.T).softmax(dim=-1)

        idx = int(sim.argmax().item())            # 0-based
        category_id = idx + 1                     # DB는 1-based
        return category_id, self._DB_CATEGORIES[category_id]

    # ──────────────────────────────────────────
    # 5-B. DeepFashion 분류
    # ──────────────────────────────────────────
    def _classify_deepfashion(self, image: Image.Image) -> Tuple[int, str]:
        inputs = self.df_processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            logits = self.df_model(**inputs).logits
        pred_idx = int(logits.argmax(-1).item())
        pred_label = self.df_id2label[pred_idx]

        category_id = self._DEEPFASHION_TO_DB.get(pred_label, 1)
        return category_id, self._DB_CATEGORIES[category_id]

    # ──────────────────────────────────────────
    # 6. 유틸
    # ──────────────────────────────────────────
    @staticmethod
    def _download_image(url: str) -> Image.Image:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return Image.open(BytesIO(resp.content)).convert("RGB")
