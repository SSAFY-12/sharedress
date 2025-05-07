import axios, {
	AxiosError,
	InternalAxiosRequestConfig,
	AxiosHeaders,
} from 'axios';
import { toast } from 'react-toastify';
import { APIError, getErrorMessage } from './errorHandler';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/authApi';

export const client = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true, // 쿠키를 포함하여 요청
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
		console.log('📤 Request interceptor:', {
			url: config.url,
			method: config.method,
			headers: config.headers,
			withCredentials: config.withCredentials,
		});

		if (!config.url?.includes('/api/auth/refresh')) {
			const token = useAuthStore.getState().accessToken;
			if (token) {
				config.headers['Authorization'] = `Bearer ${token}`;
			}
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
			console.error('❌ Request interceptor error:', error);
			handleGlobalError(0, '요청 처리 중 오류가 발생했습니다.');
			return Promise.reject(new APIError(0, '요청 처리 실패'));
		}
	},
	(error) => {
		console.error('❌ Request interceptor error:', error);
		handleGlobalError(0, '요청 구성에 실패했습니다.');
		return Promise.reject(new APIError(0, '요청 구성 오류', error));
	},
);

client.interceptors.response.use(
	(response) => {
		console.log('📥 Response interceptor success:', {
			url: response.config.url,
			status: response.status,
			headers: response.headers,
			cookies: document.cookie,
		});
		return response;
	},
	async (error: unknown) => {
		if (!(error instanceof AxiosError)) {
			console.error('❌ Unknown error in response interceptor:', error);
			return Promise.reject(error);
		}

		const status = error.response?.status;
		const serverMessage = error.response?.data?.message;
		const originalRequest = error.config;

		console.error('❌ Response interceptor error:', {
			url: originalRequest?.url,
			status,
			message: serverMessage,
			headers: error.response?.headers,
			cookies: document.cookie,
			withCredentials: originalRequest?.withCredentials,
		});

		if (!originalRequest) {
			console.error('❌ No original request found');
			return Promise.reject(error);
		}

		if (originalRequest.url?.includes('/api/auth/refresh')) {
			console.log('🔄 Refresh token request failed, redirecting to auth...');
			useAuthStore.getState().logout();
			window.location.href = '/auth';
			return Promise.reject(error);
		}

		if (status === 401) {
			console.log('🔄 Attempting token refresh...');
			try {
				const response = await authApi.refresh();
				console.log('✅ Token refresh successful:', {
					hasNewToken: !!response.content.accessToken,
				});

				const newToken = response.content.accessToken;
				useAuthStore.getState().setAccessToken(newToken);

				// 새로운 요청 설정 생성
				const newConfig: InternalAxiosRequestConfig = {
					...originalRequest,
					headers: new AxiosHeaders({
						...originalRequest.headers,
						Authorization: `Bearer ${newToken}`,
					}),
				};

				return axios(newConfig);
			} catch (refreshError) {
				if (refreshError instanceof AxiosError) {
					console.error('❌ Token refresh failed:', {
						error: refreshError,
						status: refreshError.response?.status,
						data: refreshError.response?.data,
					});
				} else {
					console.error('❌ Unknown error during token refresh:', refreshError);
				}
				useAuthStore.getState().logout();
				window.location.href = '/auth';
				return Promise.reject(refreshError);
			}
		}

		handleGlobalError(status || 500, serverMessage);
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
