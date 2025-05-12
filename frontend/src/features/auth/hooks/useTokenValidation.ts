import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 3 * 60 * 1000; // 3분 버퍼
const INITIAL_CHECK_DELAY = 3000; // 초기 체크 지연 시간 (3초)

export const useTokenValidation = () => {
	const { accessToken, isInitialized } = useAuthStore();
	const { mutateAsync: refreshAsync } = useRefresh();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// 1. 초기화 체크
		if (!isInitialized) {
			return;
		}

		// 2. 인증 관련 페이지 체크
		if (
			location.pathname === '/auth' ||
			location.pathname === '/auth/google/callback' ||
			location.pathname === '/oauth/google/callback'
		) {
			return;
		}

		// 3. 초기 체크 지연
		const initialCheckTimeout = setTimeout(() => {
			// 4. 리프레시 토큰 존재 여부 확인
			const hasRefreshToken = document.cookie.includes('refreshToken');

			// 5. 액세스 토큰이 없는 경우
			if (!accessToken) {
				// 리프레시 토큰이 있는 경우에만 갱신 시도
				if (hasRefreshToken) {
					refreshAsync()
						.then((response) => {
							console.log('✅ 토큰 갱신 성공:', {
								새토큰: !!response.content.accessToken,
								시간: new Date().toLocaleString('ko-KR'),
							});
						})
						.catch((error) => {
							console.error('❌ 토큰 갱신 실패:', error);
							navigate('/auth', { replace: true });
						});
				} else {
					// 리프레시 토큰도 없는 경우 로그인 페이지로 이동
					navigate('/auth', { replace: true });
				}
				return;
			}

			// 6. 토큰 만료 시간 체크
			const expirationTime = getTokenExpiration(accessToken);
			if (!expirationTime) {
				if (hasRefreshToken) {
					refreshAsync()
						.then((response) => {
							console.log('✅ 토큰 갱신 성공:', {
								새토큰: !!response.content.accessToken,
								시간: new Date().toLocaleString('ko-KR'),
							});
						})
						.catch((error) => {
							console.error('❌ 토큰 갱신 실패:', error);
							navigate('/auth', { replace: true });
						});
				} else {
					navigate('/auth', { replace: true });
				}
				return;
			}

			// 7. 토큰 만료 시간 계산
			const currentTime = Date.now() / 1000;
			const timeUntilExpiration = (expirationTime - currentTime) * 1000;

			// 8. 토큰 갱신 필요 여부 체크 (만료 3분 전에만 갱신)
			if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER && hasRefreshToken) {
				refreshAsync()
					.then((response) => {
						console.log('✅ 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken,
							시간: new Date().toLocaleString('ko-KR'),
						});
					})
					.catch((error) => {
						console.error('❌ 토큰 갱신 실패:', error);
						navigate('/auth', { replace: true });
					});
			}
		}, INITIAL_CHECK_DELAY);

		// 9. 주기적 토큰 상태 확인 (30초마다)
		const intervalId = setInterval(() => {
			const currentToken = useAuthStore.getState().accessToken;
			const hasRefreshToken = document.cookie.includes('refreshToken');

			if (!currentToken) {
				if (hasRefreshToken) {
					refreshAsync()
						.then((response) => {
							console.log('✅ 주기적 토큰 갱신 성공:', {
								새토큰: !!response.content.accessToken,
								시간: new Date().toLocaleString('ko-KR'),
							});
						})
						.catch((error) => {
							console.error('❌ 주기적 토큰 갱신 실패:', error);
							navigate('/auth', { replace: true });
						});
				} else {
					navigate('/auth', { replace: true });
				}
				return;
			}

			const currentExpirationTime = getTokenExpiration(currentToken);
			if (!currentExpirationTime) {
				if (hasRefreshToken) {
					refreshAsync()
						.then((response) => {
							console.log('✅ 주기적 토큰 갱신 성공:', {
								새토큰: !!response.content.accessToken,
								시간: new Date().toLocaleString('ko-KR'),
							});
						})
						.catch((error) => {
							console.error('❌ 주기적 토큰 갱신 실패:', error);
							navigate('/auth', { replace: true });
						});
				} else {
					navigate('/auth', { replace: true });
				}
				return;
			}

			const currentTime = Date.now() / 1000;
			const timeUntilExpiration = (currentExpirationTime - currentTime) * 1000;

			if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER && hasRefreshToken) {
				refreshAsync()
					.then((response) => {
						console.log('✅ 주기적 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken,
							시간: new Date().toLocaleString('ko-KR'),
						});
					})
					.catch((error) => {
						console.error('❌ 주기적 토큰 갱신 실패:', error);
						navigate('/auth', { replace: true });
					});
			}
		}, 30000);

		return () => {
			clearTimeout(initialCheckTimeout);
			clearInterval(intervalId);
		};
	}, [accessToken, refreshAsync, isInitialized, navigate, location.pathname]);
};
