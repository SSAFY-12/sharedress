# FCM(PWA) 알림 기능 설정 가이드

이 문서는 Firebase Cloud Messaging(FCM) 기반 PWA 푸시 알림 기능을 프로젝트에 적
용하는 방법을 처음부터 끝까지 설명합니다. 각 단계의 목적과 이유도 함께 안내합니
다.

---

## 1. Firebase 프로젝트 생성

- **목적:** FCM 및 기타 Firebase 서비스를 사용하려면 Firebase 프로젝트가 필요합
  니다.
- [Firebase Console](https://console.firebase.google.com/)에 접속
- "프로젝트 만들기" 클릭
- 프로젝트 이름 입력 (예: `sharedress`)
- Google Analytics 설정은 선택사항
- "프로젝트 만들기" 클릭

## 2. 웹 앱 등록

- **목적:** 웹 앱을 등록해야 웹용 FCM 설정 정보를 받을 수 있습니다.
- Firebase Console에서 생성한 프로젝트 선택
- 왼쪽 상단 "프로젝트 개요" 옆의 웹 아이콘(</>) 클릭
- 앱 닉네임 입력 (예: `sharedress-web`)
- "Firebase Hosting 설정"은 체크 해제
- "앱 등록" 클릭

## 3. Firebase 설정 정보 복사

- **목적:** 프로젝트와 앱을 연결하는 데 필요한 정보입니다.
- 앱 등록 후 아래와 같은 설정 정보가 표시됩니다:
  ```js
  const firebaseConfig = {
  	apiKey: '...',
  	authDomain: '...',
  	projectId: '...',
  	storageBucket: '...',
  	messagingSenderId: '...',
  	appId: '...',
  };
  ```
- 이 정보를 복사해둡니다.

## 4. 웹 푸시 인증서(VAPID 키) 생성

- **목적:** 브라우저 푸시 알림을 위한 인증 키입니다.
- Firebase Console > "프로젝트 설정" > "클라우드 메시징" 탭
- "웹 푸시 인증서" 섹션에서 "키 페어 생성" 클릭
- 생성된 공개 키(VAPID 키)를 복사해둡니다.

## 5. 환경 변수(.env) 설정

- **목적:** 민감한 정보를 코드에 직접 노출하지 않고 안전하게 관리합니다.
- 프로젝트 루트에 `.env` 파일 생성(또는 수정)
- 다음과 같이 입력:
  ```env
  VITE_FIREBASE_API_KEY=복사한_apiKey
  VITE_FIREBASE_AUTH_DOMAIN=복사한_authDomain
  VITE_FIREBASE_PROJECT_ID=복사한_projectId
  VITE_FIREBASE_STORAGE_BUCKET=복사한_storageBucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=복사한_messagingSenderId
  VITE_FIREBASE_APP_ID=복사한_appId
  VITE_FIREBASE_VAPID_KEY=복사한_vapidKey
  ```

## 6. 서비스 워커 파일(firebase-messaging-sw.js) 설정

- **목적:** 브라우저가 꺼져있거나 백그라운드 상태에서도 푸시 알림을 받을 수 있게
  해줍니다.
- `frontend/public/firebase-messaging-sw.js` 파일을 아래와 같이 수정:

  ```js
  importScripts(
  	'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
  );
  importScripts(
  	'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
  );

  firebase.initializeApp({
  	apiKey: '복사한_apiKey',
  	authDomain: '복사한_authDomain',
  	projectId: '복사한_projectId',
  	storageBucket: '복사한_storageBucket',
  	messagingSenderId: '복사한_messagingSenderId',
  	appId: '복사한_appId',
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
  	const notificationTitle = payload.notification.title;
  	const notificationOptions = {
  		body: payload.notification.body,
  		icon: '/android-chrome-192x192.png',
  		badge: '/favicon-32x32.png',
  		data: payload.data,
  	};
  	self.registration.showNotification(notificationTitle, notificationOptions);
  });
  ```

## 7. vite.config.ts PWA manifest 수정

- **목적:** PWA와 FCM이 올바르게 동작하도록 매니페스트에 Sender ID를 명시합니다.
- `vite.config.ts`의 PWA 플러그인 manifest에 아래 항목 추가:
  ```js
  manifest: {
    // ...
    messagingSenderId: '복사한_messagingSenderId',
    // ...
  }
  ```

## 8. Firebase SDK 설치

- **목적:** 프론트엔드에서 FCM 등 Firebase 기능을 사용하기 위해 필요합니다.
- 터미널에서 실행:
  ```bash
  npm install firebase
  ```

## 9. FCM 연동 코드 작성

- **목적:** 실제로 알림 권한을 요청하고, 토큰을 받아오고, 메시지를 수신합니다.
- 예시:

  ```ts
  import {
  	requestNotificationPermission,
  	onMessageListener,
  } from '@/config/firebase';

  useEffect(() => {
  	requestNotificationPermission();
  	onMessageListener()
  		.then((payload) => {
  			// 메시지 수신 시 처리
  			console.log('메시지 수신:', payload);
  		})
  		.catch((err) => console.log('메시지 수신 실패:', err));
  }, []);
  ```

## 10. (선택) 백엔드에서 FCM Admin SDK로 푸시 전송

- **목적:** 서버에서 특정 사용자에게 푸시 알림을 보낼 수 있습니다.
- [공식 문서 참고](https://firebase.google.com/docs/cloud-messaging/send-message)

## 11. CSP(Content Security Policy) 설정 설명

CSP는 웹 애플리케이션의 보안을 강화하기 위한 정책입니다. FCM과 PWA를 사용하기 위
해서는 특정 CSP 설정이 필요합니다.

### CSP 설정의 각 항목 설명

```typescript
const cspHeader = [
	// 기본 설정: 기본적으로 허용되는 리소스 출처
	"default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: data:",

	// 스크립트 설정: JavaScript 파일의 출처 제한
	"script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",

	// 스타일 설정: CSS 파일의 출처 제한
	"style-src 'self' 'unsafe-inline' https: http:",

	// 이미지 설정: 이미지 파일의 출처 제한
	"img-src 'self' data: https: http:",

	// 폰트 설정: 폰트 파일의 출처 제한
	"font-src 'self' data: https: http:",

	// 프레임 설정: iframe 등의 프레임 출처 제한
	"frame-src 'self' https: http:",

	// 웹소켓 설정: FCM과 Vite HMR을 위한 웹소켓 연결 허용
	"connect-src 'self' ws: wss: https: http:",

	// 워커 설정: PWA 서비스워커 허용
	"worker-src 'self' blob:",

	// 매니페스트 설정: PWA 매니페스트 파일 출처 제한
	"manifest-src 'self'",
].join('; ');
```

### FCM을 위한 중요한 CSP 설정

1. **connect-src**: FCM이 웹소켓을 통해 서버와 통신하기 위해 필요
2. **worker-src**: FCM 서비스워커가 동작하기 위해 필요
3. **script-src**: Firebase SDK 스크립트 로드를 위해 필요

## 12. Workbox 설정 설명

Workbox는 PWA의 오프라인 기능과 캐싱을 관리하는 라이브러리입니다. FCM과 함께 사
용할 때 중요한 설정들이 있습니다.

### Workbox 설정의 각 항목 설명

```typescript
workbox: {
  // 개발 로그 비활성화
  disableDevLogs: true,

  // 새 서비스워커가 즉시 모든 탭을 제어
  // FCM 메시지가 모든 탭에서 수신되도록 보장
  clientsClaim: true,

  // 새 서비스워커가 대기 없이 즉시 활성화
  // FCM 업데이트가 즉시 적용되도록 보장
  skipWaiting: true,

  // 캐시할 파일 확장자 지정
  // FCM 관련 리소스도 캐시에 포함
  globPatterns: ['**/*.{js,css,html,woff2,png,jpg,svg,mp4}'],
}
```

### FCM을 위한 중요한 Workbox 설정

1. **clientsClaim**:

   - 새 서비스워커가 즉시 모든 탭을 제어
   - FCM 메시지가 모든 열린 탭에서 수신되도록 보장
   - 사용자가 여러 탭을 열어도 모든 탭에서 알림 수신 가능

2. **skipWaiting**:

   - 새 서비스워커가 대기 없이 즉시 활성화
   - FCM 업데이트가 즉시 적용되어 알림 기능이 중단되지 않도록 보장

3. **globPatterns**:
   - 캐시할 파일 확장자 지정
   - FCM 관련 리소스도 캐시에 포함되어 오프라인에서도 기본 기능 동작

### Workbox의 장점

1. **오프라인 지원**:

   - 네트워크가 불안정해도 FCM 토큰 관리 가능
   - 오프라인 상태에서도 기본적인 앱 기능 사용 가능

2. **성능 최적화**:

   - 자주 사용되는 리소스를 캐시하여 로딩 속도 향상
   - FCM 메시지 수신 성능도 향상

3. **안정성**:
   - 서비스워커 업데이트 시 앱 기능 중단 최소화
   - FCM 알림 기능의 안정적인 동작 보장

## 13. Firebase Messaging Service Worker 설명

### 서비스 워커란?

서비스 워커는 웹 애플리케이션과 네트워크 사이의 프록시 서버 역할을 하는 스크립트
입니다. FCM에서는 백그라운드 메시지 처리를 위해 필수적입니다.

### firebase-messaging-sw.js의 역할

1. **백그라운드 메시지 처리**

   - 앱이 백그라운드 상태이거나 닫혀있을 때도 푸시 알림 수신
   - 시스템 알림으로 메시지 표시

2. **Firebase SDK 로드**

   - 서비스 워커 컨텍스트에서 Firebase SDK 사용
   - compat 버전 사용 (서비스 워커는 모듈 시스템 미지원)

3. **알림 표시 설정**
   - 알림 제목, 내용 설정
   - 알림 아이콘, 배지 설정
   - 추가 데이터 처리

### 파일 위치와 구조

```javascript
// public/firebase-messaging-sw.js

// 1. Firebase SDK 로드
importScripts(
	'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
	'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

// 2. Firebase 초기화
firebase.initializeApp({
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	// ... 다른 설정들
});

// 3. FCM 인스턴스 생성
const messaging = firebase.messaging();

// 4. 백그라운드 메시지 핸들러
messaging.onBackgroundMessage((payload) => {
	// 알림 표시 로직
});
```

### 중요 사항

1. **위치**

   - 반드시 `public` 폴더의 루트에 위치해야 함
   - 서비스 워커는 등록된 경로와 그 하위 경로에서만 동작

2. **compat 버전 사용**

   - 서비스 워커는 모듈 시스템을 지원하지 않음
   - Firebase SDK의 compat 버전을 사용해야 함

3. **환경 변수**

   - 빌드 시점에 실제 값으로 대체됨
   - 개발 환경과 프로덕션 환경의 설정 분리 가능

4. **알림 옵션**
   - `icon`: 알림에 표시될 아이콘
   - `badge`: 모바일에서 알림 배지로 표시될 아이콘
   - `data`: 알림 클릭 시 사용할 추가 데이터

### 동작 방식

1. 앱이 백그라운드 상태가 되면 서비스 워커가 활성화
2. FCM 서버로부터 메시지 수신
3. `onBackgroundMessage` 핸들러 실행
4. 시스템 알림으로 메시지 표시

### 주의사항

1. HTTPS 환경에서만 동작
2. 서비스 워커 등록은 한 번만 가능
3. 캐시된 서비스 워커는 24시간 후에 자동 업데이트
4. 디버깅은 Chrome DevTools의 Application > Service Workers 탭에서 가능

---

## 참고 및 주의사항

- **HTTPS 환경**에서만 FCM 푸시가 동작합니다. 개발 환경에서는
  `vite-plugin-mkcert` 등으로 로컬 HTTPS를 구성하세요.
- 서비스 워커 파일(`firebase-messaging-sw.js`)은 반드시 `public` 폴더(루트)에 위
  치해야 합니다.
- 환경 변수와 서비스 워커의 설정 정보가 일치해야 합니다.
- FCM 토큰은 사용자별로 백엔드에 저장해두면, 원하는 사용자에게만 푸시를 보낼 수
  있습니다.

---

## 14. Firebase 설정 파일(firebase.ts) 구현

### 파일 구조와 역할

`firebase.ts` 파일은 Firebase 초기화와 FCM 관련 기능을 제공하는 핵심 파일입니다.

### 주요 구성 요소

1. **Firebase 초기화**

   ```typescript
   const firebaseConfig = {
   	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
   	// ... 다른 설정들
   };
   const app = initializeApp(firebaseConfig);
   ```

   - 환경 변수를 사용하여 Firebase 설정
   - 보안을 위해 민감한 정보는 환경 변수로 관리

2. **FCM 인스턴스 생성**

   ```typescript
   const messaging = getMessaging(app);
   ```

   - 메시징 기능을 사용하기 위한 인스턴스 생성
   - 포그라운드/백그라운드 메시지 처리에 사용

3. **Analytics 설정**
   ```typescript
   const analytics = getAnalytics(app);
   ```
   - 사용자 행동 분석을 위한 Analytics 인스턴스
   - 선택적 기능이지만 추천됨

### 주요 함수 설명

1. **requestNotificationPermission**

   ```typescript
   export const requestNotificationPermission = async () => {
   	// 알림 권한 요청 및 FCM 토큰 발급
   };
   ```

   - 사용자에게 알림 권한 요청
   - 권한 허용 시 FCM 토큰 발급
   - 토큰은 서버에 저장하여 푸시 알림 전송에 사용

2. **onMessageListener**
   ```typescript
   export const onMessageListener = () => {
   	// 포그라운드 메시지 수신 처리
   };
   ```
   - 앱이 포그라운드 상태일 때 메시지 수신
   - Promise 기반으로 구현되어 async/await 사용 가능

### 사용 예시

```typescript
import {
	requestNotificationPermission,
	onMessageListener,
} from '@/utils/firebase';

// 컴포넌트에서 사용
useEffect(() => {
	// 알림 권한 요청 및 토큰 발급
	requestNotificationPermission();

	// 포그라운드 메시지 수신 설정
	onMessageListener()
		.then((payload) => {
			// 메시지 수신 시 처리
			console.log('메시지 수신:', payload);
		})
		.catch((err) => {
			console.error('메시지 수신 실패:', err);
		});
}, []);
```

### 주의사항

1. **환경 변수**

   - 모든 Firebase 설정은 환경 변수로 관리
   - `.env` 파일에 필요한 모든 키가 정의되어 있어야 함

2. **VAPID 키**

   - FCM 토큰 발급 시 VAPID 키 필요
   - 환경 변수에서 가져와 사용

3. **에러 처리**

   - 권한 거부, 토큰 발급 실패 등에 대한 처리 필요
   - 사용자에게 적절한 피드백 제공

4. **토큰 관리**
   - 발급된 FCM 토큰은 서버에 저장 필요
   - 토큰 갱신 시 서버 데이터도 업데이트

---

## 15. FCM 메시지 처리: 포그라운드 vs 백그라운드

### 메시지 처리 상태 구분

FCM에서는 앱의 상태에 따라 메시지 처리 방식이 다릅니다:

1. **포그라운드(Foreground)**

   - 앱이 현재 활성화되어 있고 사용자가 보고 있는 상태
   - 브라우저 탭이 열려있고 포커스가 있는 상태
   - 예: 사용자가 웹사이트를 보고 있는 상태

2. **백그라운드(Background)**

   - 앱이 열려있지만 현재 보고 있지 않은 상태
   - 다른 탭이 활성화되어 있거나 브라우저가 최소화된 상태
   - 예: 다른 웹사이트를 보고 있는 상태

3. **종료 상태(Terminated)**
   - 앱이 완전히 종료된 상태
   - 브라우저가 닫혀있는 상태
   - 예: 브라우저를 완전히 종료한 상태

### 메시지 처리 방식

1. **포그라운드 메시지 처리**

   ```typescript
   // firebase.ts에서 처리
   export const onMessageListener = () =>
   	new Promise((resolve) => {
   		onMessage(messaging, (payload) => {
   			console.log('포그라운드 메시지 수신:', payload);
   			resolve(payload);
   		});
   	});
   ```

   - 앱이 활성화된 상태에서 메시지 수신
   - 개발자가 직접 메시지 표시 방식 구현 가능
   - 커스텀 UI로 메시지 표시 가능
   - 사용자 경험을 더 세밀하게 제어 가능

2. **백그라운드/종료 상태 메시지 처리**
   ```javascript
   // firebase-messaging-sw.js에서 처리
   messaging.onBackgroundMessage((payload) => {
   	const notificationTitle = payload.notification.title;
   	const notificationOptions = {
   		body: payload.notification.body,
   		icon: '/icon.png',
   	};
   	self.registration.showNotification(notificationTitle, notificationOptions);
   });
   ```
   - 앱이 비활성화된 상태에서 메시지 수신
   - 시스템 알림으로 자동 표시
   - 서비스 워커를 통해 처리
   - 기본적인 알림 UI만 사용 가능

### 메시지 페이로드 구조

```typescript
interface FCMessagePayload {
	notification?: {
		title: string; // 알림 제목
		body: string; // 알림 내용
		image?: string; // 알림 이미지 (선택)
	};
	data?: {
		[key: string]: string; // 추가 데이터
	};
}
```

### 구현 시 주의사항

1. **포그라운드 메시지**

   - 사용자 경험을 고려한 UI 구현
   - 알림 표시 여부를 사용자가 선택할 수 있게 구현
   - 메시지 처리 후 적절한 피드백 제공

2. **백그라운드 메시지**

   - 필수적인 정보만 포함
   - 알림 클릭 시 적절한 페이지로 이동
   - 알림 아이콘과 배지 설정 확인

3. **공통 사항**
   - 메시지 우선순위 설정
   - 중요도에 따른 알림 표시 방식 구분
   - 알림 설정 관리 기능 제공

### 디버깅 팁

1. **포그라운드 메시지 디버깅**

   - 콘솔 로그를 통한 메시지 수신 확인
   - Chrome DevTools의 Application > Service Workers 탭 활용
   - Firebase Console의 메시지 전송 테스트 기능 사용

2. **백그라운드 메시지 디버깅**
   - 서비스 워커 로그 확인
   - 알림 권한 상태 확인
   - 브라우저 알림 설정 확인

---

## 참고문서

### 공식 문서

1. **Firebase Cloud Messaging**

   - [FCM 웹 푸시 알림 가이드](https://firebase.google.com/docs/cloud-messaging/js/client)
   - [FCM 웹 푸시 알림 설정](https://firebase.google.com/docs/cloud-messaging/js/topic-messaging)
   - [FCM Admin SDK](https://firebase.google.com/docs/cloud-messaging/admin/send-messages)

2. **Service Workers**

   - [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
   - [Service Worker 생명주기](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Lifecycle_events)
   - [Service Worker 사용하기](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

3. **Web Push**

   - [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
   - [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
   - [VAPID 설명](https://blog.mozilla.org/services/2016/04/04/using-vapid-with-webpush/)

4. **PWA**
   - [PWA 가이드](https://web.dev/progressive-web-apps/)
   - [Workbox 가이드](https://developers.google.com/web/tools/workbox)
   - [PWA 설치 가이드](https://web.dev/install-criteria/)

### 기술 블로그 및 아티클

1. **FCM 구현 관련**

   - [Firebase Cloud Messaging for Web](https://medium.com/firebase-developers/firebase-cloud-messaging-for-web-5f3f3b0e2d1c)
   - [FCM 웹 푸시 알림 구현하기](https://blog.logrocket.com/implementing-push-notifications-react-firebase/)
   - [FCM 토큰 관리](https://firebase.google.com/docs/cloud-messaging/manage-tokens)

2. **Service Worker 관련**

   - [Service Worker로 PWA 구현하기](https://web.dev/service-worker-lifecycle/)
   - [Service Worker 캐싱 전략](https://web.dev/service-worker-caching-and-http-caching/)
   - [Service Worker 디버깅](https://web.dev/service-worker-debugging/)

3. **보안 관련**
   - [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
   - [FCM 보안 모범 사례](https://firebase.google.com/docs/cloud-messaging/security)
   - [VAPID 보안](https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/)

### 유용한 도구

1. **개발 도구**

   - [Firebase Console](https://console.firebase.google.com/)
   - [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
   - [Workbox CLI](https://developers.google.com/web/tools/workbox/modules/workbox-cli)

2. **테스트 도구**
   - [FCM 테스트 도구](https://firebase.google.com/docs/cloud-messaging/js/test-messaging)
   - [Service Worker 테스트](https://web.dev/service-worker-testing/)
   - [PWA 감사 도구](https://web.dev/measure/)

### 커뮤니티 리소스

1. **GitHub 저장소**

   - [Firebase Web SDK](https://github.com/firebase/firebase-js-sdk)
   - [Workbox](https://github.com/GoogleChrome/workbox)
   - [Firebase Admin SDK](https://github.com/firebase/firebase-admin-node)

2. **Stack Overflow 태그**

   - [firebase-cloud-messaging](https://stackoverflow.com/questions/tagged/firebase-cloud-messaging)
   - [service-worker](https://stackoverflow.com/questions/tagged/service-worker)
   - [web-push](https://stackoverflow.com/questions/tagged/web-push)

3. **Firebase 커뮤니티**
   - [Firebase Google 그룹](https://groups.google.com/forum/#!forum/firebase-talk)
   - [Firebase Slack](https://firebase.community/)
   - [Firebase GitHub Discussions](https://github.com/firebase/firebase-js-sdk/discussions)

---

이 가이드는 위의 참고문서들을 바탕으로 작성되었으며, FCM과 PWA 구현에 대한 최신
모범 사례를 반영하고 있습니다. 각 문서는 해당 주제에 대한 더 자세한 정보와 예제
를 제공하므로, 필요에 따라 참고하시기 바랍니다.

---

## 16. 프론트엔드 구현 가이드

### 1. 알림 권한 요청

**파일**: `frontend/src/utils/firebase.ts`

```typescript
export const requestNotificationPermission = async () => {
	try {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			// 권한이 허용된 경우
			return true;
		}
		return false;
	} catch (error) {
		console.error('알림 권한 요청 중 오류:', error);
		return false;
	}
};
```

**사용 위치**:

- 앱 초기화 시
- 사용자 설정 페이지
- 알림 기능 최초 사용 시

### 2. FCM 토큰 발급

**파일**: `frontend/src/utils/firebase.ts`

```typescript
export const getFCMToken = async () => {
	try {
		const token = await getToken(messaging, {
			vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
		});
		return token;
	} catch (error) {
		console.error('FCM 토큰 발급 중 오류:', error);
		return null;
	}
};
```

**사용 위치**:

- 알림 권한이 허용된 직후
- 토큰 갱신 필요 시

### 3. 토큰 백엔드 전송

**파일**: `frontend/src/utils/firebase.ts`

```typescript
export const saveFCMToken = async (token: string) => {
	try {
		const response = await fetch('/api/notifications/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token }),
		});
		return response.ok;
	} catch (error) {
		console.error('FCM 토큰 저장 실패:', error);
		return false;
	}
};
```

**사용 위치**:

- 토큰 발급 직후
- 토큰 갱신 시

### 4. 메시지 수신 처리

#### 포그라운드 메시지

**파일**: `frontend/src/utils/firebase.ts`

```typescript
export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			console.log('포그라운드 메시지 수신:', payload);
			resolve(payload);
		});
	});
```

**사용 위치**:

- 앱의 메인 컴포넌트
- 알림이 필요한 페이지

#### 백그라운드 메시지

**파일**: `frontend/public/firebase-messaging-sw.js`

```javascript
messaging.onBackgroundMessage((payload) => {
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: '/icon.png',
	};
	self.registration.showNotification(notificationTitle, notificationOptions);
});
```

**사용 위치**:

- 서비스 워커에서 자동 처리
- 별도 구현 불필요

### 구현 예시

```typescript
// frontend/src/components/NotificationHandler.tsx
import { useEffect } from 'react';
import {
	requestNotificationPermission,
	getFCMToken,
	saveFCMToken,
	onMessageListener,
} from '@/utils/firebase';

const NotificationHandler = () => {
	useEffect(() => {
		const initializeNotifications = async () => {
			// 1. 알림 권한 요청
			const hasPermission = await requestNotificationPermission();

			if (hasPermission) {
				// 2. FCM 토큰 발급
				const token = await getFCMToken();

				if (token) {
					// 3. 토큰 백엔드 전송
					await saveFCMToken(token);

					// 4. 포그라운드 메시지 리스너 설정
					onMessageListener()
						.then((payload) => {
							// 메시지 수신 시 처리
							console.log('메시지 수신:', payload);
						})
						.catch((err) => {
							console.error('메시지 수신 실패:', err);
						});
				}
			}
		};

		initializeNotifications();
	}, []);

	return null; // UI가 필요 없는 컴포넌트
};

export default NotificationHandler;
```

### 주의사항

1. **토큰 관리**

   - 토큰은 주기적으로 갱신될 수 있음
   - 토큰 갱신 시 백엔드에 새로운 토큰 전송 필요

2. **에러 처리**

   - 권한 거부 시 적절한 안내 메시지 표시
   - 토큰 발급/저장 실패 시 재시도 로직 구현

3. **메시지 처리**

   - 포그라운드 메시지는 커스텀 UI로 표시 가능
   - 백그라운드 메시지는 시스템 알림으로 표시

4. **보안**
   - FCM 토큰은 민감한 정보로 취급
   - HTTPS 환경에서만 동작

---

## 17. FCM 테스트 가이드

### 포그라운드 메시지 테스트

1. **테스트 코드 구현**

   ```typescript
   // frontend/src/utils/firebase.ts에 추가
   export const testForegroundMessage = async () => {
   	try {
   		// 포그라운드 메시지 리스너 설정
   		onMessageListener()
   			.then((payload) => {
   				console.log('포그라운드 메시지 수신:', payload);
   				// 여기서 커스텀 UI로 메시지 표시 가능
   			})
   			.catch((err) => {
   				console.error('메시지 수신 실패:', err);
   			});
   	} catch (error) {
   		console.error('포그라운드 메시지 테스트 실패:', error);
   	}
   };
   ```

2. **테스트 방법**
   - 앱이 활성화된 상태에서 Firebase Console에서 테스트 메시지 전송
   - 브라우저 콘솔에서 메시지 수신 확인
   - 현재는 콘솔 로그만 출력됨

### 백그라운드 메시지 테스트

1. **테스트 환경 설정**

   - 브라우저 탭을 다른 탭으로 전환
   - 브라우저를 최소화
   - 다른 애플리케이션으로 전환

2. **테스트 방법**
   - Firebase Console에서 테스트 메시지 전송
   - 시스템 알림으로 메시지 표시 확인
   - 알림 클릭 시 앱으로 이동 확인

### Firebase Console에서 테스트 메시지 전송

1. **Firebase Console 접속**

   - [Firebase Console](https://console.firebase.google.com/) 접속
   - 프로젝트 선택

2. **테스트 메시지 전송**

   - 왼쪽 메뉴에서 "Cloud Messaging" 선택
   - "첫 번째 캠페인 만들기" 클릭
   - "알림 메시지" 선택
   - 다음 정보 입력:
     ```
     제목: 테스트 알림
     내용: FCM 테스트 메시지입니다.
     이미지: (선택사항)
     ```

3. **대상 설정**
   - "단일 기기" 선택
   - FCM 토큰 입력 (콘솔에서 확인한 토큰)
   - "메시지 보내기" 클릭

### 테스트 결과 확인

1. **포그라운드 메시지**

   - 브라우저 콘솔에서 로그 확인
   - 현재는 콘솔에만 출력됨
   - 예시 로그:
     ```
     포그라운드 메시지 수신: {
       notification: {
         title: "테스트 알림",
         body: "FCM 테스트 메시지입니다."
       },
       data: { ... }
     }
     ```

2. **백그라운드 메시지**
   - 시스템 알림으로 표시됨
   - 알림 제목, 내용, 아이콘 확인
   - 알림 클릭 시 앱으로 이동

### 주의사항

1. **테스트 환경**

   - HTTPS 환경에서만 동작
   - 개발 환경에서는 `vite-plugin-mkcert` 사용 권장

2. **토큰 확인**

   - 테스트 전 FCM 토큰이 정상적으로 발급되었는지 확인
   - 토큰은 콘솔에서 확인 가능

3. **권한 확인**

   - 브라우저 알림 권한이 허용되어 있는지 확인
   - 권한이 거부된 경우 재요청 필요

4. **서비스 워커 확인**
   - `firebase-messaging-sw.js`가 정상적으로 로드되었는지 확인
   - Chrome DevTools의 Application > Service Workers 탭에서 확인

### 문제 해결

1. **메시지가 수신되지 않는 경우**

   - FCM 토큰 확인
   - 알림 권한 확인
   - 서비스 워커 상태 확인
   - 콘솔 에러 확인

2. **백그라운드 알림이 표시되지 않는 경우**

   - 서비스 워커 등록 확인
   - 알림 권한 확인
   - 브라우저 설정 확인

3. **포그라운드 메시지가 로그되지 않는 경우**
   - `onMessageListener` 설정 확인
   - 콘솔 로그 필터 확인
   - 에러 핸들링 확인

---
