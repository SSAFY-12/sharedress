import os
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # 환경 변수 설정
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

    # AWS 설정
    AWS_ACCESS_KEY: str = Field(default="AKIAXTKHMY6OEIVFO5G4")
    AWS_SECRET_KEY: str = Field(default="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")
    AWS_REGION: str = Field(default="ap-northeast-2")

    # SQS 설정
    SQS_QUEUE_URL: str = Field(default="https://sqs.ap-northeast-2.amazonaws.com/your-account-id/ai-processing.fifo")

    # S3 설정
    S3_BUCKET: str = Field(default="ai-processing-output")

    # 데이터베이스 설정
    DB_HOST: str = Field(default="stg-yswa-kr-practice-db-master.mariadb.database.azure.com")
    DB_NAME: str = Field(default="S12P31A705")
    DB_USER: str = Field(default="S12P31A705@stg-yswa-kr-practice-db-master")
    DB_PASSWORD: str = Field(default="H1hN9aZkMH")
    DB_PORT: int = Field(default=3306)

    # OpenAI 설정
    OPENAI_API_KEY: str = Field(default="your-openai-api-key")

    # 완료 API 설정
    COMPLETION_API_URL: str = Field(default="https://mock.apidog.com/m1/892352-0-default/api/clothes/ai-complete")

    # 워커 설정
    WORKER_CONCURRENCY: int = Field(default=2)

settings = Settings()