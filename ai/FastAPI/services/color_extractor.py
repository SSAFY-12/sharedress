import cv2
import numpy as np
from PIL import Image
import logging
from io import BytesIO
import colorsys

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

    def _normalize_hsv(self, h, s, v):
        """Normalize HSV values to standard ranges (H: 0-360, S: 0-100, V: 0-100)"""
        return h, s * 100, v * 100

    def extract_dominant_color(self, image_bytes):
        """Extract dominant color from image using K-means clustering"""
        try:
            # Open image from bytes
            image = Image.open(image_bytes).convert("RGBA")

            # Create background image for alpha blending
            bg = Image.new("RGB", image.size, (255, 255, 255))
            bg.paste(image, mask=image.split()[3])  # 3 is the alpha channel

            # Convert to OpenCV format
            img_cv = np.array(bg)
            img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2BGR)

            # Resize for faster processing
            height, width = img_cv.shape[:2]
            if height * width > 500000:  # If larger than ~700x700
                scale = np.sqrt(500000 / (height * width))
                img_cv = cv2.resize(img_cv, (0, 0), fx=scale, fy=scale)

            # Reshape for K-means
            pixels = img_cv.reshape(-1, 3).astype(np.float32)

            # Apply K-means clustering (k=5)
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 200, 0.1)
            _, labels, centers = cv2.kmeans(pixels, 5, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

            # Get the count of pixels in each cluster
            counts = np.bincount(labels.flatten())

            # Sort clusters by size (descending)
            sorted_indices = np.argsort(counts)[::-1]

            # Get the 2 largest clusters
            largest_clusters = [centers[idx] for idx in sorted_indices[:2]]

            # Convert to HLS color space
            dominant_colors_hls = []
            for bgr_color in largest_clusters:
                # BGR to HSV conversion
                bgr_color_uint8 = np.uint8([[bgr_color]])
                hsv_color = cv2.cvtColor(bgr_color_uint8, cv2.COLOR_BGR2HSV)[0][0]

                # Normalize HSV values
                h, s, v = self._normalize_hsv(hsv_color[0] * 2, hsv_color[1] / 255, hsv_color[2] / 255)
                dominant_colors_hls.append((h, s, v))

            # The first color is the most dominant
            return dominant_colors_hls[0]

        except Exception as e:
            logger.error(f"Error extracting dominant color: {e}")
            # Default to mid-gray
            return (0, 0, 50)

    def hsv_to_hex(self, h, s, v):
        """Convert HSV color to hex color code"""
        # Convert HSV (0-360, 0-100, 0-100) to RGB (0-1, 0-1, 0-1)
        r, g, b = colorsys.hsv_to_rgb(h/360, s/100, v/100)

        # Convert to hex
        return "#{:02x}{:02x}{:02x}".format(int(r*255), int(g*255), int(b*255))

    def classify_color(self, hsv):
        """Classify HSV color to predefined color categories"""
        h, s, v = hsv

        # Handle special case - check if it's black, white, or gray first based on S and V
        if v <= 15:  # Very dark (black)
            if 25 <= h <= 45:
                return 1, "블랙 웜", self.hsv_to_hex(h, s, v)
            return 2, "블랙 쿨", self.hsv_to_hex(h, s, v)

        if v >= 90 and s <= 10:  # Very light and low saturation (white)
            if 30 <= h <= 60:
                return 3, "화이트 웜", self.hsv_to_hex(h, s, v)
            return 4, "화이트 쿨", self.hsv_to_hex(h, s, v)

        if s <= 20 and 40 <= v <= 80:  # Low saturation, mid value (gray)
            if 30 <= h <= 60:
                return 19, "그레이 웜", self.hsv_to_hex(h, s, v)
            return 20, "그레이 쿨", self.hsv_to_hex(h, s, v)

        # For colors with higher saturation, match against our defined ranges
        best_match = None
        best_score = float('inf')

        for color_id, (color_name, ranges) in self.color_ranges.items():
            h_range, s_range, v_range = ranges

            # Skip black, white, gray which we already checked
            if color_id in [1, 2, 3, 4, 19, 20]:
                continue

            # Calculate score - lower is better
            h_min, h_max = h_range
            s_min, s_max = s_range
            v_min, v_max = v_range

            # Special handling for hue wrapping (for colors like red that cross 0/360 boundary)
            if h_min > h_max:  # Wrapping case
                h_dist = min(abs(h - h_min), abs(h - (h_max + 360))) if h < h_min else min(abs(h - h_min), abs(h - h_max))
            else:
                h_dist = 0 if h_min <= h <= h_max else min(abs(h - h_min), abs(h - h_max))

            s_dist = 0 if s_min <= s <= s_max else min(abs(s - s_min), abs(s - s_max))
            v_dist = 0 if v_min <= v <= v_max else min(abs(v - v_min), abs(v - v_max))

            # Weight the distances (hue is most important)
            score = (h_dist * 1.0) + (s_dist * 0.3) + (v_dist * 0.2)

            if score < best_score:
                best_score = score
                best_match = (color_id, color_name)

        if best_match:
            color_id, color_name = best_match
            return color_id, color_name, self.hsv_to_hex(h, s, v)

        # Default fallback - just return warm red
        return 5, "레드 웜", self.hsv_to_hex(h, s, v)

    def process_image(self, image_bytes):
        """Extract and classify the dominant color from an image"""
        dominant_hsv = self.extract_dominant_color(image_bytes)
        color_id, color_name, color_hex = self.classify_color(dominant_hsv)

        return {
            "color_id": color_id,
            "color_name": color_name,
            "color_hex": color_hex,
            "hsv": dominant_hsv
        }