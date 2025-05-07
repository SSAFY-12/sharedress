import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { TokenResponse } from '@/features/auth/types/auth';
import { isTokenValid } from '@/features/auth/utils/tokenUtils';
import { AxiosError } from 'axios';

const useRefresh = () => {
	const { setAccessToken } = useAuthStore(); // 토큰 저장

	const mutation = useMutation({
		mutationFn: async () => {
			console.log('🔄 Starting token refresh...');
			try {
				const response = await authApi.refresh();
				console.log('✅ Refresh API response:', response);
				return response;
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error('❌ Refresh API error:', {
						error,
						status: error.response?.status,
						data: error.response?.data,
						headers: error.response?.headers,
						cookies: document.cookie,
					});
				} else {
					console.error('❌ Unknown error during refresh:', error);
				}
				throw error;
			}
		},
		onSuccess: (data: TokenResponse) => {
			console.log('🎉 Refresh mutation success:', {
				hasNewToken: !!data.content.accessToken,
				tokenValid: isTokenValid(data.content.accessToken),
			});

			if (!isTokenValid(data.content.accessToken)) {
				console.error('❌ Invalid token received from refresh');
				throw new Error('무효한 토큰');
			}
			setAccessToken(data.content.accessToken);
		},
		onError: (error: unknown) => {
			if (error instanceof AxiosError) {
				console.error('❌ Refresh mutation error:', {
					error,
					message: error.message,
					response: error.response?.data,
					status: error.response?.status,
					cookies: document.cookie,
				});
			} else {
				console.error('❌ Unknown error in refresh mutation:', error);
			}
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
