/**
 * Firebase Cloud Messaging Service Worker
 * 이 파일은 FCM의 백그라운드 메시지 처리를 위한 서비스 워커입니다.
 * 브라우저가 백그라운드 상태이거나 닫혀있을 때도 푸시 알림을 받을 수 있게 해줍니다.
 *
 * 위치: 반드시 public 폴더의 루트에 위치해야 합니다.
 * 이유: 서비스 워커는 등록된 경로와 그 하위 경로에서만 동작할 수 있습니다.
 */

// Firebase SDK를 서비스 워커 컨텍스트에 로드
// compat 버전을 사용하는 이유: 서비스 워커는 모듈 시스템을 지원하지 않기 때문
importScripts(
	'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js', // Firebase SDK 로드
);
importScripts(
	'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js', // Firebase Messaging SDK 로드
);

// Firebase 초기화
// 환경 변수는 빌드 시점에 실제 값으로 대체
firebase.initializeApp({
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

// Firebase Cloud Messaging 인스턴스 초기화
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('백그라운드 메시지 수신:', payload); // 백그라운드 메시지 수신

	// 알림 표시를 위한 옵션 설정
	const notificationTitle = payload.notification.title; // 알림 제목
	const notificationOptions = {
		body: payload.notification.body, // 알림 내용
		icon: '/android-chrome-192x192.png', // 알림에 표시될 아이콘
		badge: '/favicon-32x32.png', // 모바일에서 알림 배지로 표시될 아이콘
		data: payload.data, // 알림 클릭 시 사용할 추가 데이터
	};

	// 시스템 알림 표시
	self.registration.showNotification(notificationTitle, notificationOptions);
});
