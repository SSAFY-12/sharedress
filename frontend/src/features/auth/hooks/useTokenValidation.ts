import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000; // 5분

export const useTokenValidation = () => {
	const { accessToken } = useAuthStore();
	const { mutateAsync: refreshAsync } = useRefresh();

	useEffect(() => {
		if (!accessToken) {
			console.log('No access token available');
			return;
		}

		const expirationTime = getTokenExpiration(accessToken);
		if (!expirationTime) {
			console.log('Could not parse token expiration time');
			return;
		}

		const currentTime = Date.now() / 1000;
		const timeUntilExpiration = (expirationTime - currentTime) * 1000;

		console.log('Token validation check:', {
			currentTime: new Date(currentTime * 1000).toLocaleString('ko-KR', {
				timeZone: 'Asia/Seoul',
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true,
			}),
			expirationTime: new Date(expirationTime * 1000).toLocaleString('ko-KR', {
				timeZone: 'Asia/Seoul',
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true,
			}),
			timeUntilExpiration: Math.floor(timeUntilExpiration / 1000) + ' seconds',
			shouldRefresh: timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER,
		});

		if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
			console.log('Attempting to refresh token...');
			refreshAsync().catch((error) => {
				console.error('Token refresh failed:', error);
			});
		}
	}, [accessToken, refreshAsync]);
};
