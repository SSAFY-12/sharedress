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
		const { accessToken } = useAuthStore.getState();
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
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
		const { isGuest, clearAuth } = useAuthStore.getState();

		console.log('🔍 API 응답 에러:', {
			status: error.response?.status,
			url: originalRequest.url,
			시간: new Date().toLocaleString('ko-KR'),
		});

		// 401 에러가 발생했을 때
		if (error.response?.status === 401) {
			// 리프레시 토큰 요청이 아닌 경우에만 처리
			if (
				!originalRequest._retry &&
				!originalRequest.url?.includes('/auth/refresh')
			) {
				// 게스트가 아닌 경우에만 리프레시 시도
				if (!isGuest) {
					try {
						const response = await authApi.refresh();
						const newToken = response.content.accessToken;
						useAuthStore.getState().setAccessToken(newToken);
						originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
						return client(originalRequest);
					} catch (refreshError) {
						clearAuth();
						window.location.href = '/auth';
						return Promise.reject(refreshError);
					}
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
