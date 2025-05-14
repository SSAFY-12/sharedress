import axios from 'axios';
import { getErrorMessage } from './errorHandler';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/authApi';

const baseURL = import.meta.env.VITE_API_URL || 'https://www.sharedress.co.kr';

export const client = axios.create({
	baseURL,
	withCredentials: true, // 크로스 사이트 요청 시 쿠키 전송 필수
	// 리프레시 토큰이 쿠키로 전송됨 -> 크로스 도메인 요청에서 쿠키 전송 허용
	// 리프레시 토큰 자동 전송
	headers: {
		'Content-Type': 'application/json',
	},
});

// 전역 에러 처리 함수
const handleGlobalError = async (status: number, serverMessage?: string) => {
	try {
		// FCM 메시징 서비스 워커에 메시지 전송
		if ('serviceWorker' in navigator && 'Notification' in window) {
			const registration = await navigator.serviceWorker.ready;
			await registration.showNotification('오류 발생', {
				body: getErrorMessage(status),
				icon: '/android-chrome-192x192.png',
				badge: '/favicon-32x32.png',
				data: {
					status: status.toString(),
					message: serverMessage || '',
				},
			});

			// 추가 에러 메시지가 있는 경우 별도 알림
			if (serverMessage && typeof serverMessage === 'string') {
				await registration.showNotification('추가 정보', {
					body: serverMessage,
					icon: '/android-chrome-192x192.png',
					badge: '/favicon-32x32.png',
				});
			}
		}
	} catch (error) {
		console.error('FCM 알림 전송 실패:', error);
	}
};

// 비회원 허용 라우트 예외 처리
const guestAllowedPaths = [
	'/api/members/', // 예시: 비회원 프로필 조회
	'/api/link/', // 예시: 외부 링크 접근
	'/api/closet/',
	'/api/coordinations/',
];

const getPath = (url: string) => {
	try {
		return new URL(url).pathname;
	} catch {
		return url;
	}
};

// 요청 인터셉터
client.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().accessToken; // 토큰 가져오기
		if (token) {
			config.headers.Authorization = `Bearer ${token}`; // 토큰 헤더에 추가
		}
		return config;
	},
	(error) => {
		console.error('❌ 요청 인터셉터 에러 발생 :', error);
		return Promise.reject(error);
	},
);

// 응답 인터셉터
client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// 401 에러가 발생했고, 리프레시 토큰 요청이 아닌 경우에만 리프레시 시도
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.includes('/auth/refresh')
		) {
			// -------------------비회원 ------------------------

			console.log('API 요청 URL:', originalRequest.url);

			const isGuestAllowed = guestAllowedPaths.some((guestPath) =>
				getPath(originalRequest.url).startsWith(guestPath),
			);
			if (isGuestAllowed) {
				return Promise.reject(error);
			}
			// -------------------비회원 ------------------------

			originalRequest._retry = true;

			try {
				// 리프레시 토큰으로 새로운 액세스 토큰 요청
				const { content } = await authApi.refresh();
				const { accessToken } = content;

				useAuthStore.getState().setAccessToken(accessToken);

				// 원래 요청 재시도
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return client(originalRequest);
			} catch (refreshError) {
				// 리프레시 토큰 갱신 실패 시 로그아웃 처리

				if (isGuestAllowed) {
					return Promise.reject(refreshError);
				}
				const { clearAuth } = useAuthStore.getState();
				clearAuth();

				// 로그아웃 후 /auth로 이동 (항상 이동)
				window.location.href = '/auth';
				return Promise.reject(refreshError);
			}
		}

		// 전역 에러 처리
		if (error.response) {
			const { status } = error.response;
			const serverMessage = error.response.data?.message;
			handleGlobalError(status, serverMessage);
		} else {
			handleGlobalError(0, '서버와의 통신에 실패했습니다.');
		}

		return Promise.reject(error);
	},
);

export default client;
