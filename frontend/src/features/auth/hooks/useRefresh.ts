import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { TokenResponse } from '@/features/auth/types/auth';
import { isTokenValid } from '@/features/auth/utils/tokenUtils';

const useRefresh = () => {
	const { setAccessToken } = useAuthStore(); // 토큰 저장

	const mutation = useMutation({
		mutationFn: async () => {
			// 토큰 리프레시
			const response = await authApi.refresh();
			return response;
		},
		onSuccess: (data: TokenResponse) => {
			// 토큰 리프레시 성공
			if (!isTokenValid(data.content.accessToken)) {
				throw new Error('무효한 토큰');
			}
			setAccessToken(data.content.accessToken);
		},
		onError: (error) => {
			// 토큰 리프레시 실패
			console.error('토큰 리프레시 실패:', error);
			useAuthStore.getState().logout();
			window.location.href = '/auth';
		},
	});

	return {
		...mutation,
		refreshToken: mutation.mutate,
		refreshTokenAsync: mutation.mutateAsync,
	};
};

export default useRefresh;
