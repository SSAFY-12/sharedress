import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { TokenResponse } from '@/features/auth/types/auth';
import { isTokenValid } from '@/features/auth/utils/tokenUtils';
// content 내부에서 refreshToken, accessToken 저장
// 구글 자체의 토큰이 아닌, 백엔드에서 제공하는 Token 사용

const useAuth = () => {
	const { setAccessToken } = useAuthStore(); // store에서 필요한 값들을 가져옵니다

	const mutation = useMutation({
		mutationFn: (token: string) => authApi.login(token), // 구글 자체의 토큰이 아닌, 백엔드에서 제공하는 Token 사용
		onSuccess: (data: TokenResponse) => {
			// 토큰 유효성 검사
			if (!isTokenValid(data.content.accessToken)) {
				throw new Error('무효한 토큰'); // onError 처리
			}
			console.log('BE 데이터 값 확인 : ', data);
			// accessToken만 Zustand store에 저장 : 서버에서 응답한 토큰
			setAccessToken(data.content.accessToken);
		},
		onError: (error) => {
			console.error('로그인 실패:', error);
			// 특정 기능에 대한 구체적인 에러 처리
			if (error instanceof Error && error.message === '무효한 토큰') {
				window.location.href = '/login'; // 로그인 페이지로 리다이렉트
			}
		},
	});

	return {
		mutation,
	};
};

export default useAuth;
