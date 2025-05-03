import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000; // 5분

export const useTokenValidation = () => {
	// 토큰 유효성 검사, 토큰 만료되기 전 미리 갱신
	const { accessToken } = useAuthStore();
	const { mutateAsync: refreshAsync } = useRefresh(); // 토큰 갱신

	useEffect(() => {
		if (!accessToken) return; // 토큰이 없으면 종료

		const expirationTime = getTokenExpiration(accessToken); // 토큰 만료 시간 조회
		if (!expirationTime) return; // 토큰 만료 시간이 없으면 종료

		const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
		const timeUntilExpiration = (expirationTime - currentTime) * 1000; // 밀리초로 변환

		// 토큰이 만료되기 5분 전에 갱신
		if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
			refreshAsync().catch((error) => {
				//Q
				// 토큰 갱신
				console.error('Token refresh failed:', error);
				// refresh 실패시 로그인 페이지로 리다이렉트
				window.location.href = '/login';
			});
		}
	}, [accessToken, refreshAsync]);
};
