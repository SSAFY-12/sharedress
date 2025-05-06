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
		// 알림 권한 요청
		const permission = await Notification.requestPermission(); // 알림 권한 요청

		if (permission === 'granted') {
			// 알림 권한 허용
			// FCM 토큰 발급
			const token = await getToken(messaging, {
				// FCM 토큰 발급
				vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // VAPID 키 사용
			});

			// TODO: 토큰을 서버에 저장하는 로직 구현
			console.log('FCM Token:', token); // FCM 토큰 콘솔 로깅
			return token; // 토큰 반환
		} else {
			console.log('알림 권한이 거부되었습니다.'); // 알림 권한 거부
			return null; // 토큰 반환 없음
		}
	} catch (error) {
		console.error('FCM 토큰 요청 중 오류 발생:', error); // 오류 콘솔 로깅
		return null; // 토큰 반환 없음
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
			console.log('포그라운드 메시지 수신:', payload); // 포그라운드 메시지 수신
			resolve(payload); // 페이로드 반환
		});
	});
