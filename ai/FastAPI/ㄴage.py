from sagemaker import image_uris
uri = image_uris.retrieve(
    framework="huggingface",
    region="ap-northeast-2",
    image_scope="inference",
    instance_type="ml.g5.2xlarge",
    base_framework_version="2.2.1",
    version="4.37.0",          # 또는 "4.37.0"
    py_version="py310")
print(uri)
# 763104351884.dkr.ecr.ap-northeast-2.amazonaws.com/huggingface-pytorch-inference:2.2.1-transformers4.49.0-gpu-py310-cu121-ubuntu20.04
