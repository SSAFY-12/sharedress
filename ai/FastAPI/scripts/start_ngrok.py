import os
import subprocess
import time
import requests
import json

def start_ngrok():
    """ngrok 터널 시작"""
    try:
        # 기존 ngrok 프로세스 종료
        os.system("killall ngrok > /dev/null 2>&1")
        time.sleep(1)

        # ngrok 설정파일 경로
        config_path = os.path.join(os.getcwd(), "ngrok.yml")

        # ngrok 실행 (백그라운드로)
        subprocess.Popen([
            "ngrok", "start", "fastapi",
            "--config", config_path,
            "--log", "stdout"
        ], stdout=subprocess.PIPE)

        print("ngrok 터널 시작 중...")
        time.sleep(3)  # ngrok이 시작될 시간 부여

        # ngrok API에서 공개 URL 가져오기
        response = requests.get("http://localhost:4040/api/tunnels")
        tunnels = json.loads(response.text)["tunnels"]

        if tunnels:
            public_url = tunnels[0]["public_url"]
            print(f"FastAPI 서버가 다음 URL로 공개되었습니다: {public_url}")

            # 환경 변수 파일에 URL 저장
            with open(".env", "a") as env_file:
                env_file.write(f"\nPUBLIC_URL={public_url}\n")

            return public_url
        else:
            print("ngrok 터널을 찾을 수 없습니다.")
            return None

    except Exception as e:
        print(f"ngrok 시작 중 오류 발생: {str(e)}")
        return None

if __name__ == "__main__":
    start_ngrok()