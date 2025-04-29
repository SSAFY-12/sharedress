# ────────────── Runtime-only 이미지 ──────────────
# 다중 아키텍처(amd64·arm64) 지원 JRE 17
FROM eclipse-temurin:17-jre

# JAR를 넣을 디렉터리
WORKDIR /app

# 빌드된 JAR 복사 (윈도우·리눅스 모두 경로 구분자 / 가능)
COPY build/libs/*.jar app.jar
# 컨테이너 실행 시 열 포트
EXPOSE 8080

# 스프링 부트 실행
ENTRYPOINT ["java","-jar","/app/app.jar"]
