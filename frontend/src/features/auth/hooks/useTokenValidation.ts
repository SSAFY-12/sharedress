import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import useRefresh from './useRefresh';
import useFcmToken from '@/features/alert/hooks/useFcmToken';

const TOKEN_EXPIRATION_BUFFER = 3 * 60 * 1000; // 3분 버퍼
const INITIAL_CHECK_DELAY = 3000; // 초기 체크 지연 시간 (3초)

export const useTokenValidation = () => {
	const { accessToken, isInitialized } = useAuthStore();
	const { mutateAsync: refreshAsync } = useRefresh();
	const { saveFcmToken } = useFcmToken();
	const navigate = useNavigate();
	const location = useLocation();

	// 함수들을 ref로 저장하여 의존성 제거
	const saveFcmTokenRef = useRef(saveFcmToken);
	const refreshAsyncRef = useRef(refreshAsync);
	const navigateRef = useRef(navigate);

	// ref 업데이트
	useEffect(() => {
		saveFcmTokenRef.current = saveFcmToken;
		refreshAsyncRef.current = refreshAsync;
		navigateRef.current = navigate;
	}, [saveFcmToken, refreshAsync, navigate]);

	// 토큰 갱신 성공 시 FCM 토큰도 함께 처리
	const handleTokenRefresh = async () => {
		try {
			const response = await refreshAsyncRef.current();
			console.log('✅ 토큰 갱신 성공:', {
				새토큰: !!response.content.accessToken,
				시간: new Date().toLocaleString('ko-KR'),
			});
			// 토큰 갱신 성공 시 FCM 토큰 저장
			saveFcmTokenRef.current();
		} catch (error) {
			console.error('❌ 토큰 갱신 실패:', error);
			navigateRef.current('/auth', { replace: true });
		}
	};

	useEffect(() => {
		// 1. 초기화 체크
		if (!isInitialized) {
			return;
		}

		// 2. 인증 관련 페이지 체크
		if (
			location.pathname === '/auth' ||
			location.pathname === '/auth/google/callback' ||
			location.pathname === '/oauth/google/callback' ||
			location.pathname.startsWith('/link/') ||
			location.pathname.startsWith('/friend/')
		) {
			return;
		}

		// 3. 초기 체크 지연
		const initialCheckTimeout = setTimeout(() => {
			const hasRefreshToken = document.cookie.includes('refreshToken');

			if (!accessToken) {
				if (hasRefreshToken) {
					handleTokenRefresh();
				} else {
					navigateRef.current('/auth', { replace: true });
				}
				return;
			}

			const expirationTime = getTokenExpiration(accessToken);
			if (!expirationTime) {
				if (hasRefreshToken) {
					handleTokenRefresh();
				} else {
					navigateRef.current('/auth', { replace: true });
				}
				return;
			}

			const currentTime = Date.now() / 1000;
			const timeUntilExpiration = (expirationTime - currentTime) * 1000;

			if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER && hasRefreshToken) {
				handleTokenRefresh();
			}
		}, INITIAL_CHECK_DELAY);

		// 9. 주기적 토큰 상태 확인 (30초마다)
		const intervalId = setInterval(() => {
			const currentToken = useAuthStore.getState().accessToken;
			const hasRefreshToken = document.cookie.includes('refreshToken');

			if (!currentToken) {
				if (hasRefreshToken) {
					handleTokenRefresh();
				} else {
					navigateRef.current('/auth', { replace: true });
				}
				return;
			}

			const currentExpirationTime = getTokenExpiration(currentToken);
			if (!currentExpirationTime) {
				if (hasRefreshToken) {
					handleTokenRefresh();
				} else {
					navigateRef.current('/auth', { replace: true });
				}
				return;
			}

			const currentTime = Date.now() / 1000;
			const timeUntilExpiration = (currentExpirationTime - currentTime) * 1000;

			if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER && hasRefreshToken) {
				handleTokenRefresh();
			}
		}, 30000);

		return () => {
			clearTimeout(initialCheckTimeout);
			clearInterval(intervalId);
		};
	}, [accessToken, isInitialized, location.pathname]);
};
