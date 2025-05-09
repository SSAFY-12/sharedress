/**
 * Firebase 설정 및 FCM(Firebase Cloud Messaging) 구현
 * 이 파일은 Firebase 초기화와 FCM 관련 기능을 제공합니다.
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { getAnalytics } from 'firebase/analytics';

// Firebase 프로젝트 설정
// 환경 변수에서 설정값을 가져와 Firebase 초기화에 사용
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// FCM 인스턴스 생성
// 메시징 기능을 사용하기 위한 인스턴스
const messaging = getMessaging(app);

// Firebase Analytics 인스턴스 생성
// 사용자 행동 분석을 위한 인스턴스
// const analytics = getAnalytics(app);

/**
 * FCM 알림 권한 요청 및 토큰 발급
 * @returns {Promise<string|null>} FCM 토큰 또는 null
 *
 * 이 함수는 다음과 같은 작업을 수행합니다:
 * 1. 사용자에게 알림 권한 요청
 * 2. 권한이 허용된 경우 FCM 토큰 발급
 * 3. 발급된 토큰을 서버에 저장 (구현 필요)
 */

// 알림 권한 요청 및 토큰 발급
export const requestNotificationPermission = async () => {
	try {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			const token = await getToken(messaging, {
				vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
			});
			return token;
		}
		return null;
	} catch (error) {
		console.error('알림 권한 요청 실패:', error);
		return null;
	}
};

/**
 * 포그라운드 메시지 수신 리스너
 * @returns {Promise<any>} 수신된 메시지 페이로드
 *
 * 앱이 포그라운드 상태일 때 메시지를 수신하면 실행됩니다.
 * 백그라운드 메시지는 firebase-messaging-sw.js에서 처리됩니다.
 */
export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			resolve(payload);
		});
	});
