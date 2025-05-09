import torch, torchvision, torchaudio, onnxruntime as ort
print(torch.__version__, torchvision.__version__, torchaudio.__version__)
print("CUDA 사용 가능?", torch.cuda.is_available())
print("ONNX Runtime 디바이스:", ort.get_device())