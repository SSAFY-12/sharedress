import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const useRefresh = () => {
	const navigate = useNavigate();
	const { setAccessToken, clearAuth } = useAuthStore(); // 토큰 저장 및 로그아웃 함수

	return useMutation({
		mutationFn: async () => {
			// 토큰 갱신 요청(자동 재시도)
			try {
				//서버에 보내는 작업
				const response = await authApi.refresh(); // 토큰 갱신 요청(Promise를 반환)
				if (response.content.accessToken) {
					// 토큰 저장
					setAccessToken(response.content.accessToken);
				} else {
					console.error('❌ 토큰 갱신 실패: 새 토큰이 없습니다');
					throw new Error('토큰 갱신 실패: 새 토큰이 없습니다');
				}
				return response;
			} catch (error) {
				console.error('❌ 토큰 갱신 중 에러 발생:', {
					에러: error,
					시간: new Date().toLocaleString('ko-KR'),
				});
				throw error;
			}
		},
		onError: () => {
			// 리프레시 토큰이 없는 경우에만 로그인 페이지로 이동
			if (!document.cookie.includes('refreshToken')) {
				clearAuth(); // 토큰 저장 및 로그아웃 함수
				navigate('/auth'); // 로그인 페이지로 이동
			}
		},
	});
};

export default useRefresh;
