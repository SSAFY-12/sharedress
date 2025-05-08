import axios from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage } from './errorHandler';
import { useAuthStore } from '@/store/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL || 'https://www.sharedress.co.kr';

export const client = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
	// 쿠키 관련 설정 추가
	withXSRFToken: true,
	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-XSRF-TOKEN',
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
	(config) => {
		const token = useAuthStore.getState().accessToken;
		const cookies = document.cookie;

		console.log('📤 Request interceptor:', {
			url: config.url,
			method: config.method,
			headers: config.headers,
			withCredentials: config.withCredentials,
			cookies,
			hasToken: !!token,
			time: new Date().toLocaleString('ko-KR'),
		});

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
			console.log('🔑 Access token added to request:', {
				url: config.url,
				time: new Date().toLocaleString('ko-KR'),
			});
		}

		return config;
	},
	(error) => {
		console.error('❌ Request interceptor error:', error);
		return Promise.reject(error);
	},
);

client.interceptors.response.use(
	(response) => {
		const setCookie = response.headers['set-cookie'];
		console.log('📥 Response interceptor:', {
			url: response.config.url,
			status: response.status,
			hasSetCookie: !!setCookie,
			setCookie,
			time: new Date().toLocaleString('ko-KR'),
			protocol: window.location.protocol,
			hostname: window.location.hostname,
		});

		if (setCookie) {
			console.log('🍪 Set-Cookie 헤더:', setCookie);
			const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
			cookies.forEach((cookie) => {
				document.cookie = cookie;
				console.log('🍪 쿠키 설정됨:', cookie);
			});
		}

		return response;
	},
	async (error) => {
		console.error('❌ Response interceptor error:', {
			url: error.config?.url,
			status: error.response?.status,
			message: error.message,
			headers: error.response?.headers,
			cookies: document.cookie,
			time: new Date().toLocaleString('ko-KR'),
			protocol: window.location.protocol,
		});

		// 리프레시 토큰 요청 실패 시에만 clearAuth 호출
		if (
			error.response?.status === 401 &&
			error.config?.url === '/api/auth/refresh'
		) {
			console.log('🔄 Refresh token request failed');
			const { clearAuth } = useAuthStore.getState();
			clearAuth();
		}

		// 전역 에러 처리
		if (error.response) {
			const { status } = error.response;
			const serverMessage = error.response.data?.message;
			handleGlobalError(status, serverMessage);
		} else {
			// 네트워크 에러 등 response가 없는 경우
			handleGlobalError(0, '서버와의 통신에 실패했습니다.');
		}

		return Promise.reject(error);
	},
);

export default client;
