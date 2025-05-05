import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { TokenResponse } from '@/features/auth/types/auth';
import { isTokenValid } from '@/features/auth/utils/tokenUtils';
const useRefresh = () => {
	const { setAccessToken } = useAuthStore();

	// mutation 반환값 -> mutate, mutateAsync, isPending, isSuccess, isError, error
	const mutation = useMutation({
		mutationFn: () => authApi.refresh(), // 리프레시 토큰 갱신
		onSuccess: (data: TokenResponse) => {
			if (!isTokenValid(data.content.accessToken)) {
				throw new Error('무효한 토큰');
			}
			console.log('BE 데이터 값 확인 : ', data, 'refresh 토큰 갱신');
			setAccessToken(data.content.accessToken); // refresh 토큰 갱신
		},
		onError: (error) => {
			console.error('토큰 갱신 실패:', error);
			// 특정 기능에 대한 구체적인 에러 처리
			if (error instanceof Error && error.message === '무효한 토큰') {
				window.location.href = '/login'; // 로그인 페이지로 리다이렉트
			}
		},
	});

	return mutation;
};

export default useRefresh;
