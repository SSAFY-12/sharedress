#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
$ python 바지.py                 # 1.jpg 2.jpg 3.jpg → output.png
$ python 바지.py --src 착용.jpg refA.jpg refB.jpg -o result.png
"""
import argparse, base64
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()                     # .env 의 OPENAI_API_KEY 읽기
client = OpenAI()                 # 키는 환경변수에서 자동 주입

def run(src: Path, ref1: Path, ref2: Path, out: Path):
    prompt = (
        "1번 착용 사진을 2·3번 상품 컷처럼 변환해 줘. "
        "바지의 질감·핏·색·스티치를 유지하고, "
        "정면으로 평평하게 놓인 단독 상품 사진(투명 배경)으로 만들어 줘."
    )

    # ① 이미지 3장을 binary 모드로 열어 리스트에 담기
    with src.open("rb") as i0, ref1.open("rb") as i1, ref2.open("rb") as i2:
        # ② images.generate 호출 (다중 레퍼런스 지원)
        res = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            image=[i0, i1, i2],   # 최대 10장까지 가능
            n=1,
            size="1024x1024",     # 1536×1024 / 1024×1536 도 가능
            quality="low",        # low / medium / high / auto
        )

    # ③ base64 → 파일 저장
    out.write_bytes(base64.b64decode(res.data[0].b64_json))
    print("✔ 이미지 저장:", out.resolve())

if __name__ == "__main__":
    p = argparse.ArgumentParser(description="gpt-image-1 다중 레퍼런스 변환기")
    p.add_argument("--src", type=Path, default=Path("1.jpg"),
                   help="착용 컷(기본 1.jpg)")
    p.add_argument("refs", nargs="*", type=Path,
                   default=[Path("2.jpg"), Path("3.jpg")],
                   help="상품 레퍼런스 2장(기본 2.jpg·3.jpg)")
    p.add_argument("-o", "--out", type=Path, default=Path("output.png"),
                   help="저장 파일명")
    args = p.parse_args()

    if len(args.refs) != 2:
        p.error("레퍼런스 이미지는 정확히 2장을 지정해야 합니다.")
    run(args.src, *args.refs, args.out)
