import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 3 * 60 * 1000; // 3분 버퍼
const INITIAL_CHECK_DELAY = 3000; // 초기 체크 지연 시간 (3초)
const CHECK_INTERVAL = 30000; // 주기적 체크 간격 (30초)

export const useTokenValidation = () => {
	const { accessToken, isInitialized } = useAuthStore();
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
		const hasRefreshToken = document.cookie.includes('refreshToken');
		const currentToken = useAuthStore.getState().accessToken;

		console.log('🔍 토큰 검증 시작:', {
			토큰존재: !!currentToken,
			리프레시토큰존재: hasRefreshToken,
			시간: new Date().toLocaleString('ko-KR'),
		});

		if (!currentToken) {
			console.log('⚠️ 액세스 토큰 없음');
			if (hasRefreshToken) {
				return await handleTokenRefresh();
			}
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
			if (hasRefreshToken) {
				return await handleTokenRefresh();
			}
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
			console.debug(
				'[토큰검증] 🔄 토큰 갱신 시도 (만료까지 남은 시간:',
				Math.floor(timeUntilExpiration / 1000),
				'초)',
			);
			const refreshResult = await handleTokenRefresh();
			if (refreshResult) {
				console.debug('[토큰검증] ✅ 토큰 재갱신 성공');
			} else {
				console.debug('[토큰검증] ❌ 토큰 재갱신 실패');
			}
			return refreshResult;
		}

		console.log('✅ 토큰 유효');
		return true;
	}, [handleTokenRefresh, navigate]);

	useEffect(() => {
		if (!isInitialized) return;

		// 인증 관련 페이지 체크
		if (
			location.pathname === '/auth' ||
			location.pathname === '/auth/google/callback' ||
			location.pathname === '/oauth/google/callback' ||
			location.pathname.startsWith('/link/') ||
			location.pathname.startsWith('/friend/') ||
			location.pathname.startsWith('/coordinations/friends/')
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
	}, [accessToken, isInitialized, navigate, location.pathname, validateToken]);
};
