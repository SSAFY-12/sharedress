import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 14 * 60 * 1000; // 14분

export const useTokenValidation = () => {
	const { accessToken } = useAuthStore();
	const { mutateAsync: refreshAsync } = useRefresh();

	useEffect(() => {
		if (!accessToken) {
			// console.log('액세스 토큰이 없습니다');
			return;
		}

		const expirationTime = getTokenExpiration(accessToken);
		if (!expirationTime) {
			// console.log('토큰 만료 시간을 파싱할 수 없습니다');
			return;
		}

		const currentTime = Date.now() / 1000;
		const timeUntilExpiration = (expirationTime - currentTime) * 1000;

		// console.log('토큰 유효성 검사:', {
		// 	현재시간: new Date(currentTime * 1000).toLocaleString('ko-KR', {
		// 		timeZone: 'Asia/Seoul',
		// 		year: 'numeric',
		// 		month: '2-digit',
		// 		day: '2-digit',
		// 		hour: '2-digit',
		// 		minute: '2-digit',
		// 		second: '2-digit',
		// 		hour12: true,
		// 	}),
		// 	만료시간: new Date(expirationTime * 1000).toLocaleString('ko-KR', {
		// 		timeZone: 'Asia/Seoul',
		// 		year: 'numeric',
		// 		month: '2-digit',
		// 		day: '2-digit',
		// 		hour: '2-digit',
		// 		minute: '2-digit',
		// 		second: '2-digit',
		// 		hour12: true,
		// 	}),
		// 	만료까지남은시간: Math.floor(timeUntilExpiration / 1000) + ' 초',
		// 	리프레시필요: timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER,
		// 	버퍼시간: TOKEN_EXPIRATION_BUFFER / 1000 + ' 초',
		// });

		if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
			// console.log('토큰 갱신 시도 중...');
			refreshAsync().catch((error) => {
				console.error('토큰 갱신 실패:', error);
			});
		}
	}, [accessToken, refreshAsync]);
};
