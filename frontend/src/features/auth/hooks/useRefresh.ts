import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
// import { useNavigate } from 'react-router-dom';

const useRefresh = () => {
	// const navigate = useNavigate();
	const { setAccessToken, clearAuth } = useAuthStore(); // 토큰 저장 및 로그아웃 함수

	return useMutation({
		mutationFn: async () => {
			console.log('🔄 토큰 갱신 요청 시작:', {
				시간: new Date().toLocaleString('ko-KR'), // 현재 시간
				쿠키: document.cookie, // 현재 쿠키 상태
			});

			try {
				const response = await authApi.refresh(); // 토큰 갱신 요청

				console.log('✅ 토큰 갱신 응답:', {
					시간: new Date().toLocaleString('ko-KR'),
					쿠키: document.cookie, // 현재 쿠키 상태
					새토큰: !!response.content.accessToken, // 새로운 토큰 존재 여부
				});

				if (response.content.accessToken) {
					console.log('🔑 새 액세스 토큰 설정:', {
						시간: new Date().toLocaleString('ko-KR'),
						토큰존재: !!response.content.accessToken,
					});
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
		onError: (error) => {
			console.error('❌ 토큰 갱신 실패:', {
				에러: error,
				시간: new Date().toLocaleString('ko-KR'),
			});

			// 리프레시 토큰이 없는 경우에만 로그인 페이지로 이동
			if (!document.cookie.includes('refreshToken')) {
				clearAuth(); // 토큰 저장 및 로그아웃 함수
				// navigate('/auth'); // 로그인 페이지로 이동
			}
		},
	});
};

export default useRefresh;
