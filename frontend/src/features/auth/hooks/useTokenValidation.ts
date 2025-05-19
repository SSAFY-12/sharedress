import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 3 * 60 * 1000; // 3분 버퍼
const INITIAL_CHECK_DELAY = 3000; // 초기 체크 지연 시간 (3초)
const CHECK_INTERVAL = 30000; // 주기적 체크 간격 (30초)

export const useTokenValidation = () => {
	const { accessToken, isInitialized, isGuest } = useAuthStore();
	const { mutateAsync: refreshAsync } = useRefresh();
	const navigate = useNavigate();
	const location = useLocation();

	// 토큰 갱신 함수
	const handleTokenRefresh = useCallback(async () => {
		try {
			const response = await refreshAsync();
			console.log('✅ 토큰 갱신 성공:', {
				새토큰: !!response.content.accessToken,
				시간: new Date().toLocaleString('ko-KR'),
			});
			return true;
		} catch (error) {
			console.error('❌ 토큰 갱신 실패:', error);
			if (!document.cookie.includes('refreshToken')) {
				navigate('/auth', { replace: true });
			}
			return false;
		}
	}, [refreshAsync, navigate]);

	// 토큰 검증 함수
	const validateToken = useCallback(async () => {
		// 게스트인 경우 토큰 검증 완전히 건너뛰기
		if (isGuest) {
			console.log('게스트 사용자, 토큰 검증 스킵');
			return true;
		}

		const currentToken = useAuthStore.getState().accessToken;

		if (!currentToken) {
			console.log('⚠️ 액세스 토큰 없음');
			navigate('/auth', { replace: true });
			return false;
		}

		const expirationTime = getTokenExpiration(currentToken);
		console.log('⏰ 토큰 만료 시간:', {
			만료시간: expirationTime
				? new Date(expirationTime * 1000).toLocaleString('ko-KR')
				: '없음',
			현재시간: new Date().toLocaleString('ko-KR'),
		});

		if (!expirationTime) {
			console.log('⚠️ 토큰 만료 시간 없음');
			navigate('/auth', { replace: true });
			return false;
		}

		const currentTime = Date.now() / 1000;
		const timeUntilExpiration = (expirationTime - currentTime) * 1000;

		console.log('⏳ 토큰 만료까지 남은 시간:', {
			남은시간: Math.floor(timeUntilExpiration / 1000 / 60) + '분',
			버퍼시간: Math.floor(TOKEN_EXPIRATION_BUFFER / 1000 / 60) + '분',
		});

		if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
			return await handleTokenRefresh();
		}

		return true;
	}, [handleTokenRefresh, navigate, isGuest]);

	useEffect(() => {
		// 게스트이거나 초기화되지 않은 경우 검증 건너뛰기
		if (!isInitialized || isGuest) return;

		// 인증 관련 페이지 체크
		if (
			location.pathname === '/auth' ||
			location.pathname === '/auth/google/callback' ||
			location.pathname === '/oauth/google/callback' ||
			location.pathname.startsWith('/link/') ||
			location.pathname.startsWith('/friend/') ||
			location.pathname.startsWith('/coordinations/friends/') ||
			location.pathname.startsWith('/codi') ||
			location.pathname.startsWith('/cloth')
		) {
			return;
		}

		// 초기 체크
		const initialCheckTimeout = setTimeout(() => {
			validateToken();
		}, INITIAL_CHECK_DELAY);

		// 주기적 체크
		const intervalId = setInterval(() => {
			validateToken();
		}, CHECK_INTERVAL);

		return () => {
			clearTimeout(initialCheckTimeout);
			clearInterval(intervalId);
		};
	}, [
		accessToken,
		isInitialized,
		navigate,
		location.pathname,
		validateToken,
		isGuest,
	]);
};
