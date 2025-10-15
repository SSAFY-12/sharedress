# 🧥 [SHAREDRESS](https://sharedress.co.kr/)
<img width="181" height="344" alt="Image" src="https://github.com/user-attachments/assets/bf722161-7234-46cb-942f-8eaae251d07d" /> <img width="181" height="344" alt="Image" src="https://github.com/user-attachments/assets/6fab5c48-14d1-4494-add2-6060fa3f166b" /> <img width="181" height="344" alt="Image" src="https://github.com/user-attachments/assets/ea3a4d77-9fd0-4991-9d3e-845739836a99" />


---

## 📌 서비스 소개

SHAREDRESS는 사용자가 직접 보유한 옷을 디지털 옷장에 등록하고, 친구와 함께 코디를 추천하거나 공유할 수 있는 패션 공유 플랫폼입니다.

- **옷장 구축**  
  옷을 사진, 쇼핑몰 구매내역, 라이브러리 검색 등을 통해 간편하게 등록할 수 있습니다.

- **AI 기반 자동 등록 기능**  
  AI가 사진에서 옷의 컬러 분석 및 카테고리 분류를 자동 수행하여 등록을 지원합니다.

- **코디 제안 시스템**  
  친구에게 코디를 추천하거나, 외부 링크로 비회원에게도 코디를 요청할 수 있습니다.

---

## 🛠 기술 스택

| 도메인 | 기술 스택 |
|--------|-----------|
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) ![Zustand](https://img.shields.io/badge/Zustand-EF4444?&style=flat-square) ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=react-query&logoColor=white&style=flat-square) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square) |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white&style=flat-square) ![JPA](https://img.shields.io/badge/JPA-007396?logo=hibernate&logoColor=white&style=flat-square) ![QueryDSL](https://img.shields.io/badge/QueryDSL-000000?style=flat-square) ![MariaDB](https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=white&style=flat-square) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square) ![Google OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?logo=google&logoColor=white&style=flat-square) ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square) |
| **Infra** | ![AWS EC2](https://img.shields.io/badge/EC2-FF9900?logo=amazon-ec2&logoColor=white&style=flat-square) ![S3](https://img.shields.io/badge/S3-569A31?logo=amazon-s3&logoColor=white&style=flat-square) ![SQS](https://img.shields.io/badge/SQS-FF4154?logo=amazonaws&logoColor=white&style=flat-square) ![GTM](https://img.shields.io/badge/Google%20Tag%20Manager-34A853?logo=googletagmanager&logoColor=white&style=flat-square) ![Sentry](https://img.shields.io/badge/Sentry-362D59?logo=sentry&logoColor=white&style=flat-square) ![FCM](https://img.shields.io/badge/FCM-FFCA28?style=flat-square&logo=firebase) |
| **AI** | ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=flat-square) ![CLIP](https://img.shields.io/badge/CLIP-111111?style=flat-square) ![rembg](https://img.shields.io/badge/rembg-000000?style=flat-square) ![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?logo=opencv&logoColor=white&style=flat-square) ![UNO](https://img.shields.io/badge/UNO-FFB400?style=flat-square) ![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21F?logo=huggingface&logoColor=black&style=flat-square) |


---

## ⚙️ 개발 환경

- **FE IDE**: VS Code 1.98.2  
- **BE IDE**: IntelliJ IDEA 2024.3  
- **JVM**: OpenJDK 17  
- **Database**: MariaDB  
- **Server**: AWS EC2 (Amazon Linux 2023)

---

## 🚀 프로젝트 구조

### Backend
```bash
src/
└─ main/
   ├─ java/
   │  └─ com/ssafy/sharedress/
   │     ├─ adapter/                 # 프레젠테이션/어댑터 레이어 (웹 API 진입점)
   │     │  ├─ ai/in/
   │     │  ├─ auth/in/
   │     │  ├─ brand/in/
   │     │  ├─ category/in/
   │     │  ├─ closet/in/
   │     │  ├─ clothes/in/
   │     │  ├─ color/in/
   │     │  ├─ coordination/in/
   │     │  ├─ friend/in/
   │     │  ├─ handler/              # 글로벌 예외 핸들러
   │     │  ├─ member/in/
   │     │  ├─ notification/in/
   │     │  ├─ s3/                   # S3 어댑터
   │     │  └─ shoppingmall/in/
   │     │
   │     ├─ application/             # 애플리케이션 레이어 (유스케이스, 서비스, DTO, AOP)
   │     │  ├─ ai/{dto,service,usecase}
   │     │  ├─ aop/                  # 알림 전송 등 횡단 관심사
   │     │  ├─ auth/{dto,handler,service,usecase}
   │     │  ├─ brand/{dto,service,usecase}
   │     │  ├─ category/{dto,service,usecase}
   │     │  ├─ closet/{dto,service,usecase}
   │     │  ├─ clothes/{dto,service,usecase}
   │     │  ├─ color/{dto,service,usecase}
   │     │  ├─ coordination/{dto,service,usecase}
   │     │  ├─ friend/{dto,service,usecase}
   │     │  ├─ guest/{annotation,dto,filter,resolver,service,usecase}
   │     │  ├─ jwt/                   # JWT 필터/토큰/리프레시토큰 등
   │     │  ├─ member/{annotation,dto,resolver,service,usecase}
   │     │  ├─ notification/{dto,service,usecase}
   │     │  └─ shoppingmall/{dto,service,usecase}
   │     │
   │     ├─ config/                  # 스프링/인프라 설정
   │     │  # Async, Firebase, JPA, AOP Log, OpenFeign, QueryDSL, S3, Security, SQS, WebMvc 등
   │     │
   │     ├─ domain/                  # 도메인 레이어 (엔티티/리포지토리/에러/포트)
   │     │  ├─ ai/{entity,error,repository}
   │     │  ├─ brand/{entity,error,repository}
   │     │  ├─ category/{entity,error,repository}
   │     │  ├─ closet/{entity,error,repository}
   │     │  ├─ clothes/{entity,error,repository}
   │     │  ├─ clothesuploadhistory/{entity}
   │     │  ├─ color/{entity,error,repository}
   │     │  ├─ common/
   │     │  │  ├─ context/           # 유저 컨텍스트 등
   │     │  │  ├─ entity/            # 공통 베이스 엔티티
   │     │  │  └─ port/              # 외부 시스템 포트 (예: ImageStoragePort)
   │     │  ├─ coordination/{entity,error,repository}
   │     │  ├─ friend/{entity,error,repository}
   │     │  ├─ guest/{entity,error,repository}
   │     │  ├─ member/{entity,error,repository}
   │     │  ├─ notification/{entity,error,port,repository}
   │     │  └─ shoppingmall/{entity,error,repository}
   │     │
   │     └─ global/                  # 전역 공통 유틸/예외/응답 DTO
   │        ├─ dto/
   │        ├─ exception/
   │        ├─ response/
   │        └─ util/
   │
   └─ resources/
      └─ application.yaml            # 환경 설정 (프로파일별 분리 가능)
```



---

## 시스템 아키텍처
<img width="1170" height="511" alt="Image" src="https://github.com/user-attachments/assets/3ef949ec-d227-4209-bd74-c0584ed8adb6" />

---

## 팀원
| 김현래 | 박예승 | 안주민 |
|--------|--------|--------|
| <img src="https://avatars.githubusercontent.com/u/189121986?v=4" width="120"/> | <img src="https://avatars.githubusercontent.com/u/175369181?v=4" width="120"/> | <img src="https://avatars.githubusercontent.com/u/140716804?v=4" width="120"/> |
| [@hyeon-ztl](https://github.com/hyeon-ztl) | [@Yeseung-Park](https://github.com/Yeseung-Park) | [@JUMINAHN](https://github.com/JUMINAHN) |
| FE | FE | FE |

| 이준호 | 김지윤 | 이시우 |
|--------|--------|--------|
| <img src="https://avatars.githubusercontent.com/u/39540595?v=4" width="120"/> | <img src="https://avatars.githubusercontent.com/u/80970422?v=4" width="120"/> | <img src="[https://avatars.githubusercontent.com/u/00000003](https://avatars.githubusercontent.com/u/194054627?v=4)" width="120"/> |
| [@leejh7](https://github/leejh7) | [@ziy00n](https://github.com/ziy00n) | [@LEE-SIU](https://github.com/LEE-SIU) |
| BE | BE | AI |

