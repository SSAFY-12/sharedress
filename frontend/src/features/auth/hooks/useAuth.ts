import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { TokenResponse } from '@/features/auth/types/auth';
import { isTokenValid } from '@/features/auth/utils/tokenUtils';
import { useNavigate } from 'react-router-dom';
import useFcmStore from '@/store/useFcmStore';
import fcmApi from '@/features/alert/api/fcmapi';

// content 내부에서 refreshToken, accessToken 저장
// 구글 자체의 토큰이 아닌, 백엔드에서 제공하는 Token 사용
const useAuth = () => {
	const { setAccessToken, clearAuth } = useAuthStore();
	const { clearToken } = useFcmStore();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: (token: string) => authApi.login(token), // 구글 자체의 토큰이 아닌, 백엔드에서 제공하는 Token 사용
		onSuccess: async (data: TokenResponse) => {
			// 토큰 유효성 검사
			if (!isTokenValid(data.content.accessToken)) {
				throw new Error('무효한 토큰'); // onError 처리
			}
			// accessToken만 Zustand store에 저장 : 서버에서 응답한 토큰
			setAccessToken(data.content.accessToken);

			// FCM 토큰이 있으면 서버에 저장
			const fcmToken = useFcmStore.getState().token;
			if (fcmToken) {
				try {
					await fcmApi.saveFcmToken(fcmToken);
				} catch (e) {
					console.error('FCM 토큰 저장 실패:', e);
				}
			}

			// 로그인 성공 시 /mypage로 리다이렉트
			navigate('/mypage', { replace: true });
		},
		onError: (error) => {
			// 특정 기능에 대한 구체적인 에러 처리
			if (error instanceof Error && error.message === '무효한 토큰') {
				navigate('/auth', { replace: true });
			}
		},
	});

	const logout = async () => {
		try {
			await authApi.logout();
		} catch (e) {
			// 서버 에러 무시
		}
		clearAuth?.();
		clearToken?.();
		navigate('/');
	};

	return {
		mutation,
		logout,
	};
};

export default useAuth;
