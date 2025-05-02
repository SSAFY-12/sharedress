import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';

// content 내부에서 refreshToken, accessToken 저장
// 구글 자체의 토큰이 아닌, 백엔드에서 제공하는 Token 사용
interface AuthResState {
	content: {
		refreshToken: string | null;
		accessToken: string | null;
	};
}

const useAuth = () => {
	const { setAccessToken } = useAuthStore(); // store에서 필요한 값들을 가져옵니다
	// const { setAccessToken, isAuthenticated, accessToken } = useAuthStore(); // store에서 필요한 값들을 가져옵니다

	const mutation = useMutation({
		mutationFn: (token: string) => authApi.login(token),
		onSuccess: (data: AuthResState) => {
			console.log('BE 데이터 값 확인 : ', data);
			// accessToken만 Zustand store에 저장
			setAccessToken(data.content.accessToken);
			// refreshToken은 서버에서 HttpOnly Cookie로 설정되어야 합니다
		},
		onError: (error) => {
			console.error('로그인 실패:', error);
		},
	});

	return {
		mutation,
	};
};

export default useAuth;
