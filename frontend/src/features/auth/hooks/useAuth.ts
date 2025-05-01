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
	const { setAccessToken, isAuthenticated, accessToken } = useAuthStore(); // store에서 필요한 값들을 가져옵니다

	const mutation = useMutation({
		mutationFn: (code: string) => authApi.login(code),
		onSuccess: (data: AuthResState) => {
			console.log('BE 데이터 값 확인 : ', data);
			// accessToken만 Zustand store에 저장
			setAccessToken(data.content.accessToken);
			// refreshToken은 서버에서 HttpOnly Cookie로 설정되어야 합니다
		},
	});

	return {
		isAuthenticated, // store에서 관리되는 값
		accessToken, // store에서 관리되는 값
		mutation,
	};
};

export default useAuth;
