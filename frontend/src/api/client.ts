import axios from 'axios';
import { toast } from 'react-toastify';
import { APIError, getErrorMessage } from './errorHandler';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/authApi';

export const client = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

/**
 * 전역 에러 처리 함수
 * - status code에 따른 에러 메시지 표시
 * - 서버에서 전달된 추가 에러 메시지가 있다면 함께 표시
 */
const handleGlobalError = (status: number, serverMessage?: string) => {
	// 기본 에러 메시지 표시
	const defaultMessage = getErrorMessage(status);
	toast.error(defaultMessage, {
		position: 'top-right',
		autoClose: 3000,
	});

	// 서버에서 추가 에러 메시지가 있다면 표시
	if (serverMessage && typeof serverMessage === 'string') {
		toast.error(serverMessage, {
			position: 'top-right',
			autoClose: 3000,
		});
	}
};

client.interceptors.request.use(
	async (config) => {
		const token = useAuthStore.getState().accessToken;
		console.log('인터셉터에서 읽은 토큰:', token);
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		try {
			// FormData인 경우 multipart/form-data로 설정
			if (config.data instanceof FormData) {
				config.headers['Content-Type'] = 'multipart/form-data';
			} else {
				config.headers['Content-Type'] = 'application/json';
			}

			return config;
		} catch (error) {
			console.error('[Request Interceptor Error]:', error);
			handleGlobalError(0, '요청 처리 중 오류가 발생했습니다.');
			return Promise.reject(new APIError(0, '요청 처리 실패'));
		}
	},
	(error) => {
		handleGlobalError(0, '요청 구성에 실패했습니다.');
		return Promise.reject(new APIError(0, '요청 구성 오류', error));
	},
);

client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status;
		const serverMessage = error.response?.data?.message;

		// 401 에러 (인증 실패) 처리
		if (status === 401) {
			try {
				// 직접 refresh API 호출
				const response = await authApi.refresh();
				const newToken = response.content.accessToken;

				// 새 토큰 저장
				useAuthStore.getState().setAccessToken(newToken);

				// 원래 요청의 헤더에 새 토큰 설정
				error.config.headers['Authorization'] = `Bearer ${newToken}`;

				// 원래 요청 재시도
				return axios(error.config);
			} catch (refreshError) {
				console.error('토큰 리프레시 받아오는 과정에서 에러:', refreshError);
				useAuthStore.getState().logout();
				window.location.href = '/auth';
				return Promise.reject(refreshError);
			}
		}

		// 전역 에러 처리
		handleGlobalError(status, serverMessage);

		return Promise.reject(
			new APIError(
				status || 500,
				error.message || '서버 오류',
				error.response?.data,
			),
		);
	},
);

export default client;
