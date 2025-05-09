import requests
import os
import pickle
import json
import re
import logging
from bs4 import BeautifulSoup

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 저장 경로 설정
MODELS_DIR = "app/models/scrapers"
os.makedirs(MODELS_DIR, exist_ok=True)

# 직접 서비스 클래스를 import (피클링 문제 해결)
from app.services.musinsa_extractor import MusinsaCategoryExtractor

def train_musinsa_extractor():
    logger.info("무신사 카테고리 추출기 학습 시작")

    training_data = [
        {"url": "https://www.musinsa.com/products/3074973", "category": "상의"},
        {"url": "https://www.musinsa.com/products/4651524", "category": "상의"},
        {"url": "https://www.musinsa.com/products/4651528", "category": "상의"},
        {"url": "https://www.musinsa.com/products/5036577", "category": "상의"},
        {"url": "https://www.musinsa.com/products/4825004", "category": "상의"},
        {"url": "https://www.musinsa.com/products/5018263", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4998582", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4793690", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4651731", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4678582", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/4668944", "category": "아우터"},
        {"url": "https://www.musinsa.com/products/5045927", "category": "하의"},
        {"url": "https://www.musinsa.com/products/4989243", "category": "하의"},
        {"url": "https://www.musinsa.com/products/4915936", "category": "하의"},
        {"url": "https://www.musinsa.com/products/5061654", "category": "하의"},
        {"url": "https://www.musinsa.com/products/5026019", "category": "하의"},
        {"url": "https://www.musinsa.com/products/5062975", "category": "하의"},
        {"url": "https://www.musinsa.com/products/4894507", "category": "신발"},
        {"url": "https://www.musinsa.com/products/5018153", "category": "신발"},
        {"url": "https://www.musinsa.com/products/4778562", "category": "신발"},
        {"url": "https://www.musinsa.com/products/5051836", "category": "액세서리"},
        {"url": "https://www.musinsa.com/products/5076112", "category": "액세서리"},
        {"url": "https://www.musinsa.com/products/4987356", "category": "액세서리"},
        {"url": "https://www.musinsa.com/products/4707279", "category": "액세서리"},
    ]

    extractor = MusinsaCategoryExtractor()
    results = []
    success_count = 0

    for item in training_data:
        url = item["url"]
        expected_category = item["category"]

        html_content = extractor.get_html_content(url)
        if not html_content:
            logger.warning(f"URL {url} 에서 HTML을 가져올 수 없음")
            continue

        soup = BeautifulSoup(html_content, 'html.parser')
        extracted_category = extractor.extract_category(soup)
        match = extracted_category == expected_category

        if match:
            success_count += 1

        results.append({
            "url": url,
            "expected": expected_category,
            "extracted": extracted_category,
            "match": match
        })

    total = len(results)
    accuracy = (success_count / total * 100) if total else 0
    logger.info("== 훈련 결과 요약 ==")
    logger.info(f"총 {total}개 중 {success_count}개 일치 (정확도: {accuracy:.2f}%)")

    for i, r in enumerate(results, 1):
        status = "✓" if r["match"] else "✗"
        logger.info(
            f"{i}. {status} URL: {r['url'][:50]}... | "
            f"예상: {r['expected']} | 추출: {r['extracted']}"
        )

    # 정확도가 충분히 높으면 객체 저장
    if accuracy >= 70:
        logger.info(f"정확도 {accuracy:.2f}%: 추출기 저장")
        try:
            # 추출기 객체를 파일에 저장
            path = os.path.join(MODELS_DIR, "category_extractor.pkl")
            with open(path, "wb") as f:
                pickle.dump(extractor, f)
            logger.info(f"저장 완료: {path}")
        except Exception as e:
            logger.error(f"저장 오류: {e}")
    else:
        logger.warning(f"정확도 {accuracy:.2f}%: 저장 생략")

    # 테스트 URL 검증
    test_url = "https://www.musinsa.com/products/3041643"
    logger.info(f"테스트 URL: {test_url}")
    html = extractor.get_html_content(test_url)
    if html:
        soup = BeautifulSoup(html, 'html.parser')
        cat = extractor.extract_category(soup)
        logger.info(f"테스트 결과: 카테고리 → {cat}")

    logger.info("학습 완료")
    return extractor

if __name__ == "__main__":
    train_musinsa_extractor()