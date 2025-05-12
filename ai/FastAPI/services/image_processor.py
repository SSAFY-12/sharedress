import base64, logging, requests, cv2, numpy as np, torch, os
from io import BytesIO
from typing import List, Tuple
from datetime import datetime

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

        # 로그 디렉토리 생성
        self.log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
        os.makedirs(self.log_dir, exist_ok=True)

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

    def _save_image_to_log(self, img, filename):
        """이미지를 로그 디렉토리에 저장하는 유틸리티 함수"""
        if isinstance(img, BytesIO):
            img_pil = Image.open(img)
            img.seek(0)  # 버퍼 위치 리셋
        elif isinstance(img, Image.Image):
            img_pil = img
        else:
            # 다른 형식(numpy 등)은 필요에 따라 처리 추가
            return None

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_path = os.path.join(self.log_dir, f"{timestamp}_{filename}")
        img_pil.save(log_path)
        logger.info(f"이미지 로그 저장됨: {log_path}")
        return log_path

    @staticmethod
    def remove_background(buf: BytesIO) -> BytesIO:
        try:
            return BytesIO(remove(buf.getvalue()))
        except Exception as e:
            logger.error("rembg error: %s", e)
            return buf

    def _generate_with_reference(self, category: str, reference_img: Image.Image = None) -> BytesIO | None:
        """참조 이미지를 사용하여 이미지 생성"""
        try:
            # 프롬프트 준비
            prompt = f"모델이 착용하고 있는 옷 중에 해당 카테고리에 맞는 옷만 있는 상품페이지에 쓰일 상품사진을 만들어줘. 옷의 특징(핏, 질감, 색감, 프린팅 등등)을 잘 살려서. 배경은 투명하게. 이미지에 상품 전체가 나오게 가운데(짤리지않고). 카테고리는 {category}야"

            # 참조 이미지가 있는 경우
            if reference_img:
                ref_path = self._save_image_to_log(reference_img, f"reference_{category}.png")
                logger.info(f"참조 이미지 사용 ({category}): {ref_path}")

                # 이미지를 임시 파일로 저장
                temp_file = os.path.join(self.log_dir, f"temp_{category}.png")
                reference_img.save(temp_file)

                # images.edit API 사용
                try:
                    logger.info(f"이미지 편집 API 호출 (카테고리: {category}, 프롬프트: {prompt})")

                    # 이미지 편집 API 호출 - 간소화된 매개변수
                    response = self.openai.images.edit(
                        model="gpt-image-1",
                        image=[open(temp_file, "rb")],  # 파일 핸들러로 변경
                        prompt=prompt,
                        size="1024x1024",
                        quality="low"
                    )

                    # 사용 후 임시 파일 삭제
                    try:
                        os.remove(temp_file)
                    except:
                        pass

                    logger.info(f"이미지 편집 API 응답 성공")
                except Exception as e:
                    logger.error(f"이미지 편집 API 호출 실패: {e}")
                    # 실패 시 일반 생성 API로 폴백
                    logger.info(f"일반 이미지 생성 API로 폴백")
                    response = self.openai.images.generate(
                        model="gpt-image-1",
                        prompt=prompt,
                        n=1,
                        size="1024x1024",
                        quality="low",
                        output_format="png"
                    )
            else:
                # 참조 이미지 없는 경우 일반 생성
                logger.info(f"일반 이미지 생성 (카테고리: {category}, 프롬프트: {prompt})")
                response = self.openai.images.generate(
                    model="gpt-image-1",
                    prompt=prompt,
                    n=1,
                    size="1024x1024",
                    quality="low",
                    output_format="png"
                )


            # 응답 구조 확인 (로그)
            logger.info(f"Response received with data structure type: {type(response.data)}")

            # b64_json 필드가 있다면 사용
            if hasattr(response.data[0], 'b64_json') and response.data[0].b64_json:
                b64_length = len(response.data[0].b64_json) if response.data[0].b64_json else 0
                logger.info(f"Using b64_json field (length: {b64_length} bytes)")
                image_bytes = base64.b64decode(response.data[0].b64_json)
                result_buffer = BytesIO(image_bytes)

                # 결과 이미지 로깅
                result_img = Image.open(result_buffer)
                result_buffer.seek(0)  # 버퍼 위치 리셋
                self._save_image_to_log(result_img, f"result_{category}.png")

                return result_buffer

            # url 필드가 있다면 사용
            elif hasattr(response.data[0], 'url') and response.data[0].url:
                logger.info(f"Using URL field: {response.data[0].url}")
                image_response = requests.get(response.data[0].url)
                image_response.raise_for_status()
                result_buffer = BytesIO(image_response.content)

                # 결과 이미지 로깅
                result_img = Image.open(result_buffer)
                result_buffer.seek(0)  # 버퍼 위치 리셋
                self._save_image_to_log(result_img, f"result_{category}.png")

                return result_buffer

            # 로그에서 본 것처럼 b64_json이 직접 속성이 아니라 값으로 있을 경우
            else:
                # 응답 구조를 문자열로 변환하여 로깅
                logger.info(f"Response structure: {str(response.data[0])}")
                # 데이터가 문자열 형태인지 확인
                data_str = str(response.data[0])
                if 'b64_json' in data_str:
                    logger.info("Found b64_json in string representation")
                    # 문자열에서 b64_json 추출 시도
                    try:
                        import re
                        pattern = r"b64_json='([^']+)'"
                        match = re.search(pattern, data_str)
                        if match:
                            b64_data = match.group(1)
                            image_bytes = base64.b64decode(b64_data)
                            result_buffer = BytesIO(image_bytes)

                            # 결과 이미지 로깅
                            result_img = Image.open(result_buffer)
                            result_buffer.seek(0)  # 버퍼 위치 리셋
                            self._save_image_to_log(result_img, f"result_{category}.png")

                            return result_buffer
                    except Exception as e:
                        logger.error(f"Error extracting b64_json: {e}")

            # 모든 방법이 실패한 경우, 대체 방법
            logger.warning("Could not extract image data, using fallback method")
            return None

        except Exception as e:
            logger.error(f"OpenAI gen error: {e}")
            return None

    def _generate(self, category: str) -> BytesIO | None:
        """기존 _generate 메서드 - 참조 이미지 없이 생성"""
        return self._generate_with_reference(category, None)

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
                    # 이미지 로깅
                    self._save_image_to_log(img, f"no_person_{len(no_person)}_{category}.png")
            except Exception as e:
                logger.warning("DL fail %s: %s", u, e)

        # 모델이 착용한 이미지들도 로깅
        person_images = []
        try:
            for i, u in enumerate(urls):
                if i < 3:  # 처음 3개 이미지만 로깅
                    try:
                        _, img = self._download(u)
                        if self._has_person(img):
                            self._save_image_to_log(img, f"with_person_{i}_{category}.png")
                            person_images.append(img)
                    except Exception as e:
                        logger.warning(f"이미지 로깅 실패 {u}: {e}")
        except Exception as e:
            logger.warning(f"모델 이미지 로깅 중 오류: {e}")

        # ② 가장 product-like 높은 점수 선택
        if no_person:
            buf, img, score = max(no_person, key=lambda x: x[2])
            logger.info(f"사람 없는 이미지 선택됨 (score: {score})")
            self._save_image_to_log(img, f"selected_no_person_{category}.png")
            return self.remove_background(buf)

        # ③ 모델이 착용한 이미지가 있으면 참조 이미지로 사용 (최초 1개)
        if person_images:
            logger.info(f"모델 착용 이미지 참조하여 생성 시도 (카테고리: {category})")
            gen = self._generate_with_reference(category, person_images[0])
            if gen:
                return gen

        # ④ 없으면 일반 프롬프트로 DALL·E3 생성
        logger.info(f"참조 이미지 없이 생성 시도 (카테고리: {category})")
        gen = self._generate(category)
        if gen:
            return gen

        # ⑤ 최후: 첫 번째 이미지 rembg
        try:
            buf, img = self._download(urls[0])
            self._save_image_to_log(img, f"fallback_{category}.png")
            logger.info("최후 수단: 첫 번째 이미지 배경 제거")
            return self.remove_background(buf)
        except Exception as e:
            logger.error("Ultimate fallback error: %s", e)
            return None