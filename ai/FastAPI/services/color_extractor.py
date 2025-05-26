import logging, colorsys
from io import BytesIO
from typing import Tuple, List, Dict, Any, Optional
import os

import cv2, numpy as np
from PIL import Image
from sklearn.cluster import KMeans     # pip install scikit-learn

# 새로 추가되는 라이브러리들
import torch
from torchvision import transforms, models
from colorthief import ColorThief
import requests
from pathlib import Path

logger = logging.getLogger(__name__)

class ColorExtractor:
    def __init__(self):
        # 원래 색상 범위 정의는 유지
        self.color_ranges = {
            # Format: (color_id, color_name, [(h_min, h_max), (s_min, s_max), (v_min, v_max)])

            # Black
            1: ("블랙 웜", [(25, 45), (5, 15), (0, 15)]),
            2: ("블랙 쿨", [(210, 270), (5, 15), (0, 15)]),

            # White
            3: ("화이트 웜", [(30, 60), (0, 10), (90, 100)]),
            4: ("화이트 쿨", [(210, 270), (0, 10), (90, 100)]),

            # Red
            5: ("레드 웜", [(0, 30), (80, 100), (70, 100)]),
            6: ("레드 쿨", [(330, 359), (80, 100), (70, 100)]),

            # Blue
            7: ("블루 웜", [(180, 210), (70, 100), (70, 100)]),
            8: ("블루 쿨", [(220, 250), (70, 100), (70, 100)]),

            # Green
            9: ("그린 웜", [(80, 140), (60, 100), (60, 100)]),
            10: ("그린 쿨", [(140, 180), (60, 100), (60, 100)]),

            # Yellow
            11: ("옐로우 웜", [(45, 65), (80, 100), (80, 100)]),
            12: ("옐로우 쿨", [(65, 80), (70, 100), (90, 100)]),

            # Purple
            13: ("퍼플 웜", [(280, 320), (60, 100), (60, 90)]),
            14: ("퍼플 쿨", [(250, 280), (60, 100), (60, 90)]),

            # Pink
            15: ("핑크 웜", [(340, 359), (30, 70), (80, 100)]),
            16: ("핑크 쿨", [(280, 340), (30, 70), (80, 100)]),

            # Brown
            17: ("브라운 웜", [(20, 40), (50, 80), (30, 60)]),
            18: ("브라운 쿨", [(0, 20), (30, 60), (30, 60)]),

            # Gray
            19: ("그레이 웜", [(30, 60), (5, 20), (40, 80)]),
            20: ("그레이 쿨", [(210, 270), (5, 20), (40, 80)])
        }

        # 색상 이름과 ID 매핑 (역매핑)
        self.color_name_to_id = {name: cid for cid, (name, _) in self.color_ranges.items()}

        # ColorThief + ResNet 초기화
        self.use_ml_model = True
        self.models_dir = Path('models/color_models')
        self.models_dir.mkdir(parents=True, exist_ok=True)

        try:
            self._init_resnet()
            logger.info("ResNet 색상 분류 모델 초기화 완료")
        except Exception as e:
            logger.warning(f"ResNet 모델 초기화 실패: {e}, 기존 방식으로 폴백")
            self.use_ml_model = False

    def _init_resnet(self):
        """ResNet 모델 초기화"""
        # 모델 정의
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = models.resnet18(pretrained=True)
        num_ftrs = self.model.fc.in_features
        self.model.fc = torch.nn.Linear(num_ftrs, len(self.color_ranges))  # 색상 카테고리 수에 맞게 조정

        # 모델 가중치 경로
        weights_path = self.models_dir / 'color_classifier_weights.pth'

        # 가중치 파일이 있으면 로드, 없으면 다운로드 시도 또는 기본 모델 사용
        if weights_path.exists():
            self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
            logger.info("색상 분류 가중치 로드 성공")
        else:
            # 가중치 파일 없음을 로그로 기록하고 기본 모델 사용
            logger.warning("색상 분류 가중치 파일 없음, 기본 ResNet 모델 사용")
            # 미래에 가중치 파일을 다운로드하거나 생성하는 로직 추가 가능

        self.model = self.model.to(self.device)
        self.model.eval()

        # 이미지 전처리 파이프라인
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    # ───────────────────────────────────────────
    @staticmethod
    def _rgba_pixels(img: Image.Image) -> np.ndarray:
        """알파 > 10 인 전경 픽셀만 반환"""
        if img.mode == "RGBA":
            a = np.array(img.split()[-1])
            rgb = np.array(img.convert("RGB"))
            mask = a > 10
            px = rgb[mask]
            if len(px) < 500:                # 전경픽셀 적으면 전체 사용
                px = rgb.reshape(-1, 3)
        else:
            px = np.array(img).reshape(-1, 3)
        return px.astype(np.float32)

    # ───────────────────────────────────────────
    def _dominant_hsv(self, pil_img: Image.Image, k: int = 3) -> Tuple[float, float, float]:
        """K-means 클러스터링으로 주요 HSV 값 추출 (기존 방식)"""
        pixels = self._rgba_pixels(pil_img)
        km = KMeans(n_clusters=k, n_init="auto", random_state=42).fit(pixels)
        counts = np.bincount(km.labels_)
        bgr = km.cluster_centers_[np.argmax(counts)]
        hsv = cv2.cvtColor(np.uint8([[bgr]]), cv2.COLOR_BGR2HSV)[0][0].astype(float)
        h = hsv[0] * 2.0          # 0-360
        s = hsv[1] / 255.0 * 100  # 0-100
        v = hsv[2] / 255.0 * 100
        return h, s, v

    # ───────────────────────────────────────────
    def _extract_dominant_colors_with_colorthief(self, pil_img: Image.Image, count: int = 5) -> List[Tuple[float, float, float, float]]:
        """ColorThief로 주요 색상 팔레트 추출"""
        try:
            # 임시 파일로 저장
            temp_path = 'temp_img.jpg'
            pil_img.save(temp_path)

            # ColorThief로 팔레트 추출
            ct = ColorThief(temp_path)
            palette = ct.get_palette(color_count=count)

            # 임시 파일 삭제
            try:
                os.remove(temp_path)
            except:
                pass

            # RGB를 HSV로 변환하고 가중치 계산
            hsv_palette = []
            for i, (r, g, b) in enumerate(palette):
                h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
                # 가중치는 팔레트 순서에 따라 감소 (첫 색상이 가장 중요)
                weight = 1.0 if i == 0 else 0.8 ** i
                hsv_palette.append((h*360, s*100, v*100, weight))

            return hsv_palette
        except Exception as e:
            logger.warning(f"ColorThief 색상 추출 실패: {e}")
            # 실패 시 빈 리스트 반환
            return []

    # ───────────────────────────────────────────
    def _classify_with_resnet(self, pil_img: Image.Image) -> int:
        """ResNet 모델로 색상 분류"""
        try:
            if not self.use_ml_model:
                return None

            # 이미지 전처리
            input_tensor = self.transform(pil_img)
            input_batch = input_tensor.unsqueeze(0).to(self.device)

            # 예측
            with torch.no_grad():
                output = self.model(input_batch)

            # 예측된 클래스 가져오기
            _, predicted = torch.max(output, 1)
            color_id = predicted.item() + 1  # 0부터 시작하므로 +1

            # 신뢰도 점수
            confidence = torch.nn.functional.softmax(output, dim=1)[0][predicted].item()

            logger.info(f"ResNet 색상 분류 결과: ID={color_id}, 신뢰도={confidence:.2f}")

            # 높은 신뢰도의 결과만 반환
            if confidence > 0.7:  # 임계값 조정 가능
                return color_id
            else:
                return None

        except Exception as e:
            logger.error(f"ResNet 색상 분류 실패: {e}")
            return None

    # ───────────────────────────────────────────
    def _to_hex(self, h, s, v):
        """HSV를 HEX 색상 코드로 변환"""
        r, g, b = colorsys.hsv_to_rgb(h / 360, s / 100, v / 100)
        return f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"

    # ───────────────────────────────────────────
    def _classify(self, h: float, s: float, v: float):
        """기존 HSV 기반 색상 분류 (백업용)"""
        # 특별 케이스(black/white/gray) 먼저
        if v <= 15:
            return (1 if 25 <= h <= 45 else 2), self._to_hex(h, s, v)
        if v >= 90 and s <= 10:
            return (3 if 30 <= h <= 60 else 4), self._to_hex(h, s, v)
        if s <= 20 and 40 <= v <= 80:
            return (19 if 30 <= h <= 60 else 20), self._to_hex(h, s, v)

        # 범위 기반 매칭
        best, score = None, 1e9
        for cid, (name, rng) in self.color_ranges.items():
            (h1, h2), (s1, s2), (v1, v2) = rng
            if cid in (1, 2, 3, 4, 19, 20):     # 이미 처리
                continue
            # Hue wrapping
            if h1 > h2:
                hd = 0 if h >= h1 or h <= h2 else min(abs(h - h1), abs(h - h2))
            else:
                hd = 0 if h1 <= h <= h2 else min(abs(h - h1), abs(h - h2))
            sd = 0 if s1 <= s <= s2 else min(abs(s - s1), abs(s - s2))
            vd = 0 if v1 <= v <= v2 else min(abs(v - v1), abs(v - v2))
            sc = hd * 1.0 + sd * 0.3 + vd * 0.2
            if sc < score:
                score, best = sc, cid
        hex_code = self._to_hex(h, s, v)
        return best or 5, hex_code   # fallback: 5(레드 웜)

    # ───────────────────────────────────────────
    def process_image(self, pil_img: Image.Image, k: int = 3):
        """향상된 이미지 처리 및 색상 분석"""
        results = []

        # 1. ResNet 모델로 색상 분류 시도
        resnet_color_id = None
        if self.use_ml_model:
            resnet_color_id = self._classify_with_resnet(pil_img)
            if resnet_color_id:
                color_name = self.color_ranges[resnet_color_id][0]
                logger.info(f"ResNet 모델로 색상 분류 결과: {color_name} (ID: {resnet_color_id})")
                results.append((resnet_color_id, 0.8))  # 높은 가중치 부여

        # 2. K-means 클러스터링으로 주요 색상 추출 (기존 방식)
        h, s, v = self._dominant_hsv(pil_img, k)
        kmeans_color_id, hex_code = self._classify(h, s, v)
        color_name = self.color_ranges[kmeans_color_id][0]
        logger.info(f"K-means 클러스터링 색상 결과: {color_name} (ID: {kmeans_color_id})")
        results.append((kmeans_color_id, 0.6))  # 중간 가중치

        # 3. ColorThief로 주요 색상 추출
        colorthief_colors = self._extract_dominant_colors_with_colorthief(pil_img)
        if colorthief_colors:
            # 첫 번째(가장 지배적인) 색상만 사용
            ct_h, ct_s, ct_v, _ = colorthief_colors[0]
            ct_color_id, _ = self._classify(ct_h, ct_s, ct_v)
            ct_color_name = self.color_ranges[ct_color_id][0]
            logger.info(f"ColorThief 색상 결과: {ct_color_name} (ID: {ct_color_id})")
            results.append((ct_color_id, 0.7))  # 높은 가중치

        # 4. 가중치 기반으로 최종 색상 결정
        if not results:
            # 결과가 없으면 기본값 사용
            final_color_id = 5  # 레드 웜 (기본값)
            final_color_name = self.color_ranges[final_color_id][0]
        else:
            # 가중치를 고려한 투표 시스템
            color_votes = {}
            for color_id, weight in results:
                if color_id not in color_votes:
                    color_votes[color_id] = 0
                color_votes[color_id] += weight

            # 가장 높은 투표를 받은 색상 선택
            final_color_id = max(color_votes.items(), key=lambda x: x[1])[0]
            final_color_name = self.color_ranges[final_color_id][0]

        logger.info(f"최종 선택된 색상: {final_color_name} (ID: {final_color_id})")

        # 5. HEX 코드는 항상 K-means 결과 사용 (시각적 일관성)
        return {
            "color_id": final_color_id,
            "color_name": final_color_name,
            "color_hex": hex_code,
            "hsv": (h, s, v)
        }