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
        return any(int(b.cls) == 0 and float(b.conf) > .65
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
            prompt = f"모델이 착용하고 있는 옷 중에 해당 카테고리에 맞는 옷만 있는 상품페이지에 쓰일 상품사진을 만들어줘. 옷의 특징(핏, 질감, 색감, 톤 , 프린팅, 단추, 스티치, 포인트 등등)을 잘 살려서. 배경은 투명하게. 이미지에 상품 전체가 나오게 가운데(짤리지않고 위 아래 여유 공간이 있게). 카테고리는 {category}야"

            # 이미지 스코어 로깅 추가
            if reference_img:
                ref_score = self._product_score(reference_img)
                logger.info(f"GPT 호출 - 참조 이미지 사용 (카테고리: {category}, 참조 이미지 스코어: {ref_score})")
                ref_path = self._save_image_to_log(reference_img, f"reference_{category}.png")
                logger.info(f"참조 이미지 저장됨: {ref_path}")

                # 이미지를 임시 파일로 저장
                temp_file = os.path.join(self.log_dir, f"temp_{category}.png")
                reference_img.save(temp_file)

                # images.edit API 사용
                try:
                    logger.info(f"GPT 이미지 편집 API 호출 (카테고리: {category}, 프롬프트: {prompt})")

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

                    logger.info(f"GPT 이미지 편집 API 응답 성공 (참조 이미지 스코어: {ref_score})")
                except Exception as e:
                    logger.error(f"GPT 이미지 편집 API 호출 실패: {e}")
                    # 실패 시 일반 생성 API로 폴백
                    logger.info(f"일반 이미지 생성 API로 폴백 (참조 이미지 스코어: {ref_score})")
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
                logger.info(f"GPT 일반 이미지 생성 (카테고리: {category}, 참조 이미지 없음)")
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

        # 제품 스코어 임계값 설정 - 이 값보다 높으면 제품 이미지로 간주
        PRODUCT_SCORE_THRESHOLD = 0.060  # 조정 가능한 값

        # ① 후보 수집: '사람 없는' 이미지 전부 + 스코어가 높은 이미지
        no_person: list[Tuple[BytesIO, Image.Image, float, int]] = []  # 인덱스 추가
        high_score_images: list[Tuple[BytesIO, Image.Image, float, int]] = []  # 인덱스 추가

        for i, u in enumerate(urls):
            try:
                buf, img = self._download(u)
                has_person = self._has_person(img)
                score = self._product_score(img)

                # 모든 이미지의 스코어와 사람 탐지 결과 로깅
                logger.info(f"이미지 {i+1} 분석 (URL: {u}, 사람 있음: {has_person}, 상품 스코어: {score})")

                # 스코어가 임계값보다 높으면 높은 스코어 후보에 추가
                if score >= PRODUCT_SCORE_THRESHOLD:
                    high_score_images.append((buf, img, score, i))  # 인덱스 저장
                    logger.info(f"높은 스코어 이미지 추가: {score} >= {PRODUCT_SCORE_THRESHOLD}")
                    self._save_image_to_log(img, f"high_score_{len(high_score_images)}_{category}.png")

                # 사람이 없는 이미지는 기존처럼 수집
                if not has_person:
                    no_person.append((buf, img, score, i))  # 인덱스 저장
                    self._save_image_to_log(img, f"no_person_{len(no_person)}_{category}.png")

            except Exception as e:
                logger.warning("DL fail %s: %s", u, e)

        # 모델 착용 이미지 로깅 (변경 없음)
        person_images = []
        try:
            for i, u in enumerate(urls):
                if i < 3:  # 처음 3개 이미지만 로깅
                    try:
                        _, img = self._download(u)
                        if self._has_person(img):
                            wear_score = self._product_score(img)
                            logger.info(f"모델 착용 이미지 {i+1} 분석 (URL: {u}, 상품 스코어: {wear_score})")
                            self._save_image_to_log(img, f"with_person_{i}_{category}.png")
                            person_images.append((img, wear_score))
                    except Exception as e:
                        logger.warning(f"이미지 로깅 실패 {u}: {e}")
        except Exception as e:
            logger.warning(f"모델 이미지 로깅 중 오류: {e}")

        # ② 높은 스코어 이미지가 있으면 우선 사용 (인덱스 순서 우선)
        if high_score_images:
            # 기준치를 넘는 이미지들이 있으면, 인덱스 순으로 정렬 (오름차순)
            high_score_images.sort(key=lambda x: x[3])
            buf, img, score, idx = high_score_images[0]  # 첫 번째 (원래 순서가 가장 빠른) 이미지 선택
            logger.info(f"높은 스코어 이미지 선택됨 (카테고리: {category}, 스코어: {score}, 원래 순서: {idx+1})")
            self._save_image_to_log(img, f"selected_high_score_{category}.png")
            return self.remove_background(buf)

        # ③ 사람이 없는 이미지가 있으면 다음 우선순위로 사용 (인덱스 순서 우선)
        if no_person:
            # 사람 없는 이미지들도 인덱스 순으로 정렬 (오름차순)
            no_person.sort(key=lambda x: x[3])
            buf, img, score, idx = no_person[0]  # 첫 번째 (원래 순서가 가장 빠른) 이미지 선택
            logger.info(f"사람 없는 이미지 선택됨 (카테고리: {category}, 스코어: {score}, 원래 순서: {idx+1})")
            self._save_image_to_log(img, f"selected_no_person_{category}.png")
            return self.remove_background(buf)

        # 나머지 로직은 기존과 동일
        # ④ 모델 착용 이미지가 있으면 참조하여 GPT 생성
        if person_images:
            best_img, best_score = max(person_images, key=lambda x: x[1])
            logger.info(f"GPT 호출 - 모델 착용 이미지 참조 (카테고리: {category}, 베스트 스코어: {best_score})")
            gen = self._generate_with_reference(category, best_img)
            if gen:
                return gen

        # ⑤ 참조 이미지 없이 GPT 생성
        logger.info(f"GPT 호출 - 참조 이미지 없이 생성 시도 (카테고리: {category})")
        gen = self._generate(category)
        if gen:
            return gen

        # ⑥ 최후 수단: 첫 번째 이미지 배경 제거
        try:
            buf, img = self._download(urls[0])
            score = self._product_score(img)
            self._save_image_to_log(img, f"fallback_{category}.png")
            logger.info(f"최후 수단: 첫 번째 이미지 배경 제거 (스코어: {score})")
            return self.remove_background(buf)
        except Exception as e:
            logger.error("Ultimate fallback error: %s", e)
            return None