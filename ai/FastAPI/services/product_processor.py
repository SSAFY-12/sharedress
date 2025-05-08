import logging
from io import BytesIO
import aiohttp
import asyncio
from typing import Optional, Tuple

from services.html_extractor import HTMLExtractor
from services.category_classifier import CategoryClassifier
from services.image_processor import ImageProcessor
from services.color_extractor import ColorExtractor
from services.s3_service import S3Service
from services.db_service import DBService
from models.dto import ProductProcessingResult

logger = logging.getLogger(__name__)

class ProductProcessor:
    def __init__(self):
        """Initialize product processor with required services"""
        self.html_extractor = HTMLExtractor()
        self.category_classifier = CategoryClassifier()
        self.image_processor = ImageProcessor()
        self.color_extractor = ColorExtractor()
        self.s3_service = S3Service()
        self.db_service = DBService()

    async def download_image(self, image_url: str) -> Optional[BytesIO]:
        """이미지 URL에서 이미지를 비동기적으로 다운로드"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url) as response:
                    if response.status == 200:
                        image_data = await response.read()
                        return BytesIO(image_data)
                    else:
                        logger.warning(f"이미지 다운로드 실패: {response.status} - {image_url}")
                        return None
        except Exception as e:
            logger.error(f"이미지 다운로드 중 오류: {e} - {image_url}")
            return None

    def _get_color_name(self, hex_code: str, tone: str) -> str:
        """HEX 코드와 톤을 기반으로 색상 이름 결정"""
        # 기본 색상명 매핑
        base_colors = {
            "black": "블랙",
            "white": "화이트",
            "red": "레드",
            "blue": "블루",
            "green": "그린",
            "yellow": "옐로우",
            "purple": "퍼플",
            "pink": "핑크",
            "brown": "브라운",
            "gray": "그레이"
        }

        # 간단한 색상 판단 로직 (실제로는 더 복잡한 알고리즘 사용)
        # 예시 코드이므로 실제로는 HSV 값을 기반으로 해야 함
        hex_code = hex_code.lstrip('#')
        r, g, b = int(hex_code[0:2], 16), int(hex_code[2:4], 16), int(hex_code[4:6], 16)

        # 간단한 색상 판단 (실제로는 더 정교한 알고리즘 사용)
        if max(r, g, b) < 40:  # 매우 어두움
            base_color = "black"
        elif min(r, g, b) > 200 and max(r, g, b) > 230:  # 매우 밝음
            base_color = "white"
        elif r > max(g, b) + 50:  # 빨강 계열
            if g > 100 and b < 100:  # 주황색 계열
                base_color = "brown" if g < 150 else "yellow"
            else:
                base_color = "red" if g < 150 and b < 150 else "pink"
        elif g > max(r, b) + 50:  # 초록 계열
            base_color = "green"
        elif b > max(r, g) + 50:  # 파랑 계열
            base_color = "blue"
        elif r > 150 and g > 150 and b < 100:  # 노랑 계열
            base_color = "yellow"
        elif r > 120 and b > 120 and g < 100:  # 보라 계열
            base_color = "purple"
        elif abs(r - g) < 30 and abs(r - b) < 30 and abs(g - b) < 30:  # 회색 계열
            base_color = "gray"
        elif r > 120 and g > 60 and b < 60:  # 갈색 계열
            base_color = "brown"
        else:
            # 기본값은 회색으로 설정
            base_color = "gray"

        # 최종 색상명 생성
        color_name = f"{base_colors[base_color]} {tone}"
        return color_name

    async def process_product(self, url: str, desired_color: Optional[str] = None, message_id: Optional[str] = None) -> ProductProcessingResult:
        """상품 URL을 처리하고 결과 반환"""
        try:
            logger.info(f"상품 처리 시작: {url}")

            # HTML에서 메타데이터 및 이미지 URL 추출
            html_data = self.html_extractor.extract_from_url(url, desired_color)

            if "error" in html_data:
                logger.error(f"HTML 추출 실패: {html_data['error']}")
                return self._create_error_result(url, message_id, f"HTML 추출 실패: {html_data['error']}")

            # 이미지 URL 확인
            image_urls = html_data.get("image_urls", [])
            if not image_urls:
                logger.warning("이미지 URL을 찾을 수 없습니다. 단독 이미지 생성을 시도합니다.")
                # 추출된 카테고리 정보 사용
                category_text = html_data.get("category_text", "상의")
                # OpenAI를 사용하여 상품 단독 이미지 생성
                processed_image = await self.image_processor.generate_product_image(None, category_text)
                if processed_image is None:
                    return self._create_error_result(url, message_id, "이미지 URL을 찾을 수 없고 생성에도 실패했습니다.")
            else:
                # 첫 번째 이미지 다운로드
                image_data = await self.download_image(image_urls[0])
                if image_data is None:
                    logger.warning("이미지 다운로드 실패. 단독 이미지 생성을 시도합니다.")
                    # 추출된 카테고리 정보 사용
                    category_text = html_data.get("category_text", "상의")
                    # OpenAI를 사용하여 상품 단독 이미지 생성
                    processed_image = await self.image_processor.generate_product_image(image_urls[0], category_text)
                    if processed_image is None:
                        return self._create_error_result(url, message_id, "이미지 다운로드 실패 및 생성 실패")
                else:
                    # 이미지 처리 (배경 제거)
                    processed_image = self.image_processor.remove_background(image_data)
                    if processed_image is None:
                        logger.warning("배경 제거 실패. 단독 이미지 생성을 시도합니다.")
                        # 추출된 카테고리 정보 사용
                        category_text = html_data.get("category_text", "상의")
                        # OpenAI를 사용하여 상품 단독 이미지 생성
                        processed_image = await self.image_processor.generate_product_image(image_urls[0], category_text)
                        if processed_image is None:
                            return self._create_error_result(url, message_id, "배경 제거 및 이미지 생성 실패")

            # 카테고리 분류 - HTML 추출 결과에서 카테고리 정보 사용
            category_text = html_data.get("category_text", "상의")

            # 카테고리 텍스트를 DB 카테고리 ID로 변환
            category_mapping = {
                "상의": 1,
                "아우터": 2,
                "하의": 3,
                "신발": 4,
                "악세사리": 5
            }

            category_id = category_mapping.get(category_text, 1)  # 기본값은 상의(1)
            category_name = category_text

            logger.info(f"카테고리 분류 결과: {category_name} (ID: {category_id})")

            # 주 색상 추출
            color_data = self.color_extractor.process_image(processed_image)
            color_id = color_data['color_id']
            color_name = color_data['color_name']
            color_hex = color_data['color_hex']
            logger.info(f"색상 추출 결과: {color_name} (ID: {color_id}, HEX: {color_hex})")

            # S3에 업로드
            processed_image.seek(0)
            image_uri = self.s3_service.upload_image(processed_image, category_id, color_id)

            if not image_uri:
                logger.error("S3 업로드 실패")
                return self._create_error_result(url, message_id, "S3 업로드 실패")

            # DB 레코드 생성
            clothes_id = self.db_service.create_clothes_record(image_uri, category_id, color_id)

            if not clothes_id:
                logger.error("DB 레코드 생성 실패")
                return self._create_error_result(url, message_id, "DB 레코드 생성 실패")

            # 색상 HEX 코드 저장 확인
            self.db_service.update_color_hex(color_id, color_hex)

            # 결과 생성
            product_name = html_data.get('product_name', 'Unknown Product')
            result = ProductProcessingResult(
                url=url,
                product_name=product_name,
                category_id=category_id,
                category_name=category_name,
                color_id=color_id,
                color_name=color_name,
                color_hex=color_hex,
                image_uri=image_uri,
                processing_status="SUCCESS",
                message_id=message_id
            )

            logger.info(f"상품 처리 완료: {url}")
            return result

        except Exception as e:
            logger.error(f"상품 처리 중 오류: {e}")
            return self._create_error_result(url, message_id, f"상품 처리 중 오류: {str(e)}")
        finally:
            # DB 연결 닫기
            self.db_service.close()

    def _create_error_result(self, url, message_id, error_message):
        """오류 결과 객체 생성"""
        return ProductProcessingResult(
            url=url,
            product_name="Error",
            category_id=1,  # 기본값: 상의
            category_name="상의",
            color_id=1,  # 기본값: 블랙 웜
            color_name="블랙 웜",
            color_hex="#000000",
            image_uri="",
            processing_status="ERROR",
            message_id=message_id
        )