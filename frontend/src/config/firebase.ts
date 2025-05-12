import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// FCM 토큰 요청 및 저장
export const requestNotificationPermission = async () => {
	try {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			const token = await getToken(messaging, {
				vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
			});

			// 토큰을 서버에 저장하는 로직 추가
			console.log('FCM Token:', token);
			return token;
		} else {
			console.log('알림 권한이 거부되었습니다.');
			return null;
		}
	} catch (error) {
		console.error('FCM 토큰 요청 중 오류 발생:', error);
		return null;
	}
};

// 포그라운드 메시지 핸들링
export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			console.log('포그라운드 메시지 수신:', payload);
			resolve(payload);
		});
	});
