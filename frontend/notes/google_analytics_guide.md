# Google Analytics 설정 및 사용 가이드

## 1. 현재 구현된 기능(세부 로깅X)

### 1.1 Google Analytics 기본 스크립트 (`index.html`)

```html
<script
	async
	src="https://www.googletagmanager.com/gtag/js?id=%VITE_GOOGLE_TAG_ID%"
></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', '%VITE_GOOGLE_TAG_ID%');
</script>
```

- **역할**: Google Analytics의 기본적인 데이터 수집 시작
- **측정 정보**:
  - 웹사이트 방문자 수
  - 사용자 브라우저 정보
  - 사용자 디바이스 정보
  - 사용자 위치 정보
  - 웹사이트 로딩 시간

### 1.2 페이지 뷰 자동 추적 (`GoogleAnalytics.tsx`)

```typescript
useEffect(() => {
	trackPageView(location.pathname, document.title);
}, [location]);
```

- **역할**: 페이지 이동 시 자동 추적
- **측정 정보**:
  - 방문한 페이지
  - 페이지 체류 시간
  - 페이지 간 이동 경로
  - 이탈률

### 1.3 추적 유틸리티 함수 (`analytics.ts`)

```typescript
// 페이지 뷰 추적
export const trackPageView = (path: string, title: string) => {
	window.gtag('event', 'page_view', {
		page_path: path,
		page_title: title,
	});
};

// 이벤트 추적
export const trackEvent = (
	eventName: string,
	eventParams?: { [key: string]: any },
) => {
	window.gtag('event', eventName, eventParams);
};
```

- **역할**: 다양한 이벤트 추적을 위한 함수 제공
- **사용 가능한 추적**:
  - 페이지 뷰
  - 커스텀 이벤트
  - (준비됨) 클릭, 스크롤, 검색 이벤트

## 2. Google Analytics 대시보드에서 확인 가능한 정보

### 2.1 실시간 보고서

- 현재 접속 중인 사용자 수
- 현재 보고 있는 페이지
- 사용자 위치

### 2.2 획득 보고서

- 유입 경로 (검색, 소셜, 직접 방문 등)
- 사용자 디바이스 정보
- 사용자 국가/도시

### 2.3 참여 보고서

- 페이지별 방문자 수
- 평균 체류 시간
- 이탈률
- 사용자 행동 흐름

### 2.4 전환 보고서

- (준비됨) 특정 목표 달성률 추적

## 3. 사용 예시

### 3.1 페이지 뷰 추적

```typescript
// 자동으로 추적됨
// 사용자가 /wardrobe 페이지로 이동하면 자동으로 추적
// 사용자가 /codi 페이지로 이동하면 자동으로 추적
```

### 3.2 이벤트 추적 (준비됨)

```typescript
// 버튼 클릭 추적
trackClick('login_button', 'login-form');

// 스크롤 추적
trackScroll(window.scrollY);

// 검색 추적
trackSearch('검색어');

// 커스텀 이벤트 추적
trackEvent('purchase', {
	product_id: '123',
	amount: 10000,
	currency: 'KRW',
});
```

## 4. 추가 가능한 추적 기능

다음과 같은 추가 기능을 구현할 수 있습니다:

- 특정 버튼 클릭 추적
- 페이지 스크롤 깊이 추적
- 검색 기능 추적
- 폼 제출 추적
- 비디오 시청 추적
- 파일 다운로드 추적
