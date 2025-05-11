import logging, colorsys
from io import BytesIO
from typing import Tuple

import cv2, numpy as np
from PIL import Image
from sklearn.cluster import KMeans     # pip install scikit-learn

logger = logging.getLogger(__name__)

class ColorExtractor:
    def __init__(self):
        # Define color categories with HSV ranges
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
    def _to_hex(self, h, s, v):
        r, g, b = colorsys.hsv_to_rgb(h / 360, s / 100, v / 100)
        return f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"
    # ───────────────────────────────────────────
    def _classify(self, h: float, s: float, v: float):
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
            h1, h2, s1, s2, v1, v2 = rng
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
        h, s, v = self._dominant_hsv(pil_img, k)
        cid, hex_code = self._classify(h, s, v)
        cname = self.color_ranges[cid][0]
        return {"color_id": cid, "color_name": cname,
                "color_hex": hex_code, "hsv": (h, s, v)}