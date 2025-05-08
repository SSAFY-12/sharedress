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
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
	// 쿠키 관련 설정 추가
	withXSRFToken: true,
	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-XSRF-TOKEN',
});

// 쿠키 설정을 위한 헬퍼 함수
// const setCookie = (name: string, value: string, days: number) => {
// 	const expires = new Date();
// 	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
// 	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;domain=${
// 		window.location.hostname
// 	};SameSite=Strict`;
// };

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
			cookies: document.cookie,
		});

		if (!config.url?.includes('/api/auth/refresh')) {
			const token = useAuthStore.getState().accessToken;
			if (token) {
				config.headers['Authorization'] = `Bearer ${token}`;
			}
		}

		try {
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
			setCookie: response.headers['set-cookie'],
		});

		// Set-Cookie 헤더가 있는 경우 처리
		const setCookieHeader = response.headers['set-cookie'];
		if (setCookieHeader) {
			console.log('🍪 Received Set-Cookie header:', setCookieHeader);
		}

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
			// useAuthStore.getState().logout();
			// window.location.href = '/auth';
			return Promise.reject(error);
		}

		if (status === 401) {
			const retryCount = (originalRequest as any)._retryCount || 0;

			if (retryCount < 2) {
				(originalRequest as any)._retryCount = retryCount + 1;
				console.log(
					`🔄 Token refresh attempt ${retryCount + 1}/2, cookies:`,
					document.cookie,
				);

				try {
					const response = await authApi.refresh();
					console.log('✅ Token refresh successful:', {
						hasNewToken: !!response.content.accessToken,
						attempt: retryCount + 1,
						cookies: document.cookie,
					});

					const newToken = response.content.accessToken;
					useAuthStore.getState().setAccessToken(newToken);

					const newConfig: InternalAxiosRequestConfig = {
						...originalRequest,
						headers: new AxiosHeaders({
							...originalRequest.headers,
							Authorization: `Bearer ${newToken}`,
						}),
					};

					return axios(newConfig);
				} catch (refreshError) {
					console.error('❌ Token refresh failed:', {
						error: refreshError,
						attempt: retryCount + 1,
						cookies: document.cookie,
					});

					if (retryCount === 1) {
						// 마지막 시도에서 실패한 경우에만 로그아웃
						// useAuthStore.getState().logout();
						// window.location.href = '/auth';
					}
					return Promise.reject(refreshError);
				}
			} else {
				console.error('❌ Max retry attempts reached for token refresh');
				// useAuthStore.getState().logout();
				// window.location.href = '/auth';
				return Promise.reject(error);
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
