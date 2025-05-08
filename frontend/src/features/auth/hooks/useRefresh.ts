import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { TokenResponse } from '@/features/auth/types/auth';
import { isTokenValid } from '@/features/auth/utils/tokenUtils';
import { AxiosError } from 'axios';

/**
 * 토큰 갱신을 위한 커스텀 훅
 * @returns mutation 객체와 갱신 함수들
 */

const useRefresh = () => {
	const { setAccessToken } = useAuthStore(); // store에서 필요한 값들을 가져옵니다

	const mutation = useMutation({
		mutationFn: async () => {
			try {
				const response = await authApi.refresh();
				// console.log('✅ 갱신 API 응답:', {
				//   토큰존재: !!response.content.accessToken,
				//   시간: new Date().toLocaleString('ko-KR')
				// });
				return response;
			} catch (error) {
				if (error instanceof AxiosError) {
					// console.error('❌ 갱신 API 오류:', {
					//   에러: error,
					//   상태: error.response?.status,
					//   데이터: error.response?.data,
					//   헤더: error.response?.headers,
					// 쿠키: document.cookie
					// });
				} else {
					// console.error('❌ 알 수 없는 갱신 오류:', error);
				}
				throw error;
			}
		},
		onSuccess: (data: TokenResponse) => {
			console.log('🎉 갱신 성공:', {
				새토큰: !!data.content.accessToken,
				토큰유효: isTokenValid(data.content.accessToken),
			});

			if (!isTokenValid(data.content.accessToken)) {
				// console.error('❌ 유효하지 않은 토큰이 수신됨');
				throw new Error('무효한 토큰');
			}
			setAccessToken(data.content.accessToken);
			localStorage.setItem('마지막갱신', new Date().toLocaleString('ko-KR'));
		},
		onError: (error: unknown) => {
			if (error instanceof AxiosError) {
				// console.error('❌ 갱신 오류:', {
				//   에러: error,
				//   메시지: error.message,
				//   응답: error.response?.data,
				//   상태: error.response?.status,
				//   쿠키: document.cookie
				// });
			} else {
				// console.error('❌ 알 수 없는 갱신 오류:', error);
			}
			localStorage.removeItem('마지막갱신');
			// useAuthStore.getState().logout();
			// window.location.href = '/auth';
		},
	});

	return {
		...mutation,
		refreshToken: mutation.mutate,
		refreshTokenAsync: mutation.mutateAsync,
	};
};

export default useRefresh;
