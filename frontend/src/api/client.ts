import axios from 'axios';
import { getErrorMessage } from './errorHandler';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/authApi';

const baseURL = import.meta.env.VITE_API_URL || 'https://www.sharedress.co.kr';

export const client = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 전역 에러 처리 함수
const handleGlobalError = async (status: number, serverMessage?: string) => {
	const errorMessage = serverMessage || getErrorMessage(status);
	console.error(`API Error (${status}):`, errorMessage);

	// 비회원(게스트)이면 알림 자체를 띄우지 않음
	if (useAuthStore.getState().isGuest) {
		return;
	}

	try {
		// FCM 메시징 서비스 워커에 메시지 전송
		if ('serviceWorker' in navigator && 'Notification' in window) {
			if (Notification.permission === 'granted') {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification('오류 발생', {
					body: errorMessage,
					icon: '/new-android-chrome-192x192.png',
					badge: '/new-favicon-32x32.png',
					data: {
						status: status.toString(),
						message: serverMessage || '',
					},
				});

				// 추가 에러 메시지가 있는 경우 별도 알림
				if (serverMessage && typeof serverMessage === 'string') {
					await registration.showNotification('추가 정보', {
						body: serverMessage,
						icon: '/new-android-chrome-192x192.png',
						badge: '/new-favicon-32x32.png',
					});
				}
			}
		}
	} catch (error) {
		console.error('FCM 알림 전송 실패:', error);
	}
};

// 요청 인터셉터
client.interceptors.request.use(
	(config) => {
		const { accessToken, isGuest } = useAuthStore.getState();

		// 액세스 토큰이 있으면 Bearer 토큰으로 전송
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		// 게스트인 경우 쿠키 전송
		else if (isGuest) {
			config.withCredentials = true;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// 응답 인터셉터
client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const { isGuest } = useAuthStore.getState();

		if (error.response?.status === 401) {
			// console.log('401 에러 발생:', {
			// 	url: originalRequest.url,
			// 	isGuest,
			// 	isRetry: originalRequest._retry,
			// });

			// 게스트인 경우 401 에러를 그대로 반환하고 리다이렉트하지 않음
			if (isGuest) {
				if (originalRequest.url?.includes('/coordinations')) {
					delete originalRequest.headers.Authorization;
					return client(originalRequest);
				}
				// console.log('게스트 사용자 401 에러 처리:', originalRequest.url);
				return Promise.reject(error);
			}

			// 게스트가 아닌 경우에만 리프레시 시도
			if (
				!originalRequest._retry &&
				!originalRequest.url?.includes('/auth/refresh')
			) {
				originalRequest._retry = true;
				try {
					const { content } = await authApi.refresh();
					const { accessToken } = content;
					useAuthStore.getState().setAccessToken(accessToken);
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					return client(originalRequest);
				} catch (refreshError) {
					// console.log('토큰 리프레시 실패, 게스트로 전환');
					useAuthStore.getState().setIsGuest(true);
					useAuthStore.getState().clearAuth();
					return Promise.reject(error);
				}
			}
		}

		// 전역 에러 처리
		if (error.response) {
			const { status } = error.response.data.status;
			const serverMessage = error.response.data?.message;
			handleGlobalError(status, serverMessage);
		} else {
			handleGlobalError(0, '서버와의 통신에 실패했습니다.');
		}

		return Promise.reject(error);
	},
);
