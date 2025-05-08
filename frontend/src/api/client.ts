import axios from 'axios';
import { toast } from 'react-toastify';
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
const handleGlobalError = (status: number, serverMessage?: string) => {
	// 기본 에러 메시지 표시
	const defaultMessage = getErrorMessage(status); // 에러 메시지 표시
	toast.error(defaultMessage, {
		// 토스트 메시지 표시
		position: 'top-right', // 토스트 위치
		autoClose: 3000, // 토스트 자동 닫기 시간
	});

	// 서버에서 추가 에러 메시지가 있다면 표시
	if (serverMessage && typeof serverMessage === 'string') {
		// 서버에서 추가 에러 메시지가 있다면 표시
		toast.error(serverMessage, {
			// 토스트 메시지 표시
			position: 'top-right', // 토스트 위치
			autoClose: 3000, // 토스트 자동 닫기 시간
		});
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
		const originalRequest = error.config; // 원래 요청 정보 저장(실패한 요청의 정보)
		// config 속성은 원래 요청했던 API 설정 정보를 가지고 있음(어떤 메서드, 데이터)

		// 401 에러가 발생했고, 리프레시 토큰 요청이 아닌 경우에만 리프레시 시도(아직 재시도하지 않은 경우)
		if (error.response?.status === 401 && !originalRequest._retry) {
			// originalRequest._retry 초기화를 통해서 무한 루프 방지(직접 만든 플래그 === 재시도 여부 판단)
			// retry flag true로 설정 -> 재시도 여부 판단
			originalRequest._retry = true;

			try {
				// 리프레시 토큰으로 새로운 액세스 토큰 요청
				const { content } = await authApi.refresh(); // 리프레시 토큰 요청 => TokenResponse
				const { accessToken } = content; // 새로운 액세스 토큰 저장

				useAuthStore.getState().setAccessToken(accessToken); // 새로운 액세스 토큰 저장

				// 원래 요청 재시도
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return client(originalRequest); // 재시도 => 새로운 액세스 토큰 요청
			} catch (refreshError) {
				// 리프레시 토큰 갱신 실패 시 로그아웃 처리
				const { clearAuth } = useAuthStore.getState(); // 로그아웃 처리
				clearAuth();
				// 로그인 페이지로 리다이렉트
				window.location.href = '/auth';
			}
		}

		// 전역 에러 처리
		if (error.response) {
			const { status } = error.response; // 에러 상태 코드
			const serverMessage = error.response.data?.message; // 서버 에러 메시지
			handleGlobalError(status, serverMessage); // 전역 에러 처리
		} else {
			// 네트워크 에러 등 response가 없는 경우
			handleGlobalError(0, '서버와의 통신에 실패했습니다.'); // 전역 에러 처리
		}

		return Promise.reject(error);
	},
);

export default client;
