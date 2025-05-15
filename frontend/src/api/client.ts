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
			// 코디 관련 API는 게스트도 허용
			if (
				config.url?.includes('/coordinations/my') ||
				config.url?.includes('/coordinations/friends/') ||
				config.url?.includes('/codi/edit') ||
				config.url?.includes('/codi/save')
			) {
				console.log('게스트 코디 요청:', config.url);
			}
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
			console.log('401 에러 발생:', {
				url: originalRequest.url,
				isGuest,
				isRetry: originalRequest._retry,
			});

			// 게스트인 경우 401 에러를 그대로 반환하고 리다이렉트하지 않음
			if (isGuest) {
				console.log('게스트 사용자 401 에러 처리:', originalRequest.url);
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
					console.log('토큰 리프레시 실패, 게스트로 전환');
					useAuthStore.getState().setIsGuest(true);
					useAuthStore.getState().clearAuth();
					return Promise.reject(error);
				}
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

// 전역 에러 핸들러
const handleGlobalError = (status: number, message?: string) => {
	const errorMessage = message || getErrorMessage(status);
	console.error(`API Error (${status}):`, errorMessage);
	// 여기에 필요한 에러 처리 로직 추가 (예: 토스트 메시지 표시 등)
};
