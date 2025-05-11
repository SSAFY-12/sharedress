import logging
logging.basicConfig(level=logging.DEBUG)

# 각 모듈을 하나씩 가져와보기
try:
    print("Importing HTMLExtractor...")
    from services.html_extractor import HTMLExtractor
    print("Success!")
except Exception as e:
    print(f"Error importing HTMLExtractor: {e}")

try:
    print("Importing ImageProcessor...")
    from services.image_processor import ImageProcessor
    print("Success!")
except Exception as e:
    print(f"Error importing ImageProcessor: {e}")

try:
    print("Creating instances...")
    html_extractor = HTMLExtractor()
    image_processor = ImageProcessor()
    print("Success!")
except Exception as e:
    print(f"Error creating instances: {e}")

print("Test completed")