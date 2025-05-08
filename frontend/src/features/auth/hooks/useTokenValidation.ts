import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 14 * 60 * 1000; // 14분 버퍼

// 브라우저 콘솔에서 토큰 만료 시간 확인용
const token = useAuthStore.getState().accessToken; // 토큰 상태
if (token) {
	const expirationTime = getTokenExpiration(token); // 토큰 만료 시간
	if (expirationTime) {
		console.log('🔑 현재 토큰 만료 시간:', {
			만료시간: new Date(expirationTime * 1000).toLocaleString('ko-KR'), // 토큰 만료 시간
			현재시간: new Date().toLocaleString('ko-KR'), // 현재 시간
		});
	} else {
		console.log('❌ 토큰 만료 시간을 파싱할 수 없습니다.');
	}
} else {
	console.log('⚠️ 토큰이 없습니다. (초기 로드 또는 로그아웃 상태)');
}

export const useTokenValidation = () => {
	const { accessToken } = useAuthStore(); // 토큰 상태
	const { mutateAsync: refreshAsync } = useRefresh(); // 토큰 갱신 요청

	useEffect(() => {
		// 토큰이 없을 때도 리프레시 시도
		if (!accessToken) {
			console.log('🔄 토큰이 없어 리프레시 시도:', {
				시간: new Date().toLocaleString('ko-KR'),
			});
			refreshAsync()
				.then((response) => {
					console.log('✅ 토큰 갱신 성공:', {
						새토큰: !!response.content.accessToken, // 새로운 토큰 존재 여부
						시간: new Date().toLocaleString('ko-KR'), // 현재 시간
					});
				})
				.catch((error) => {
					console.error('❌ 토큰 갱신 실패:', {
						에러: error,
						시간: new Date().toLocaleString('ko-KR'),
					});
				});
			return;
		}

		const expirationTime = getTokenExpiration(accessToken);
		if (!expirationTime) {
			console.log('❌ 토큰 만료 시간을 파싱할 수 없습니다. 리프레시 시도');
			refreshAsync() // 토큰 갱신 요청
				.then((response) => {
					console.log('✅ 토큰 갱신 성공:', {
						새토큰: !!response.content.accessToken, // 새로운 토큰 존재 여부
						시간: new Date().toLocaleString('ko-KR'), // 현재 시간
					});
				})
				.catch((error) => {
					console.error('❌ 토큰 갱신 실패:', {
						에러: error,
						시간: new Date().toLocaleString('ko-KR'),
					});
				});
			return;
		}

		const currentTime = Date.now() / 1000; // 현재 시간
		const timeUntilExpiration = (expirationTime - currentTime) * 1000; // 토큰 만료 시간

		console.log('🔄 토큰 유효성 검사:', {
			현재시간: new Date(currentTime * 1000).toLocaleString('ko-KR', {
				timeZone: 'Asia/Seoul', // 시간대
				year: 'numeric', // 년
				month: '2-digit', // 월
				day: '2-digit', // 일
				hour: '2-digit', // 시
				minute: '2-digit', // 분
				second: '2-digit', // 초
				hour12: true,
			}),
			만료시간: new Date(expirationTime * 1000).toLocaleString('ko-KR', {
				timeZone: 'Asia/Seoul', // 시간대
				year: 'numeric', // 년
				month: '2-digit', // 월
				day: '2-digit', // 일
				hour: '2-digit', // 시
				minute: '2-digit', // 분
				second: '2-digit', // 초
				hour12: true,
			}),
			만료까지남은시간: Math.floor(timeUntilExpiration / 1000) + ' 초', // 토큰 만료 시간
			리프레시필요: timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER, // 토큰 갱신 필요 여부
			버퍼시간: TOKEN_EXPIRATION_BUFFER / 1000 + ' 초', // 토큰 갱신 버퍼 시간
		});

		// 토큰 갱신이 필요한 경우
		if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
			console.log('🔄 토큰 갱신 시도 중...');
			refreshAsync()
				.then((response) => {
					console.log('✅ 토큰 갱신 성공:', {
						새토큰: !!response.content.accessToken,
						시간: new Date().toLocaleString('ko-KR'),
					});
				})
				.catch((error) => {
					console.error('❌ 토큰 갱신 실패:', {
						에러: error,
						시간: new Date().toLocaleString('ko-KR'),
					});
				});
		}

		// 주기적으로 토큰 상태 확인 (30초마다)
		const intervalId = setInterval(() => {
			const currentToken = useAuthStore.getState().accessToken; // 토큰 상태
			if (!currentToken) {
				console.log('⚠️ 토큰이 없어졌습니다. 리프레시 시도');
				refreshAsync() // 토큰 갱신 요청
					.then((response) => {
						console.log('✅ 주기적 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken, // 새로운 토큰 존재 여부
							시간: new Date().toLocaleString('ko-KR'), // 현재 시간
						});
					})
					.catch((error) => {
						console.error('❌ 주기적 토큰 갱신 실패:', {
							에러: error,
							시간: new Date().toLocaleString('ko-KR'),
						});
					});
				return;
			}

			const currentExpirationTime = getTokenExpiration(currentToken);
			if (!currentExpirationTime) {
				console.log('❌ 토큰 만료 시간을 파싱할 수 없습니다. 리프레시 시도');
				refreshAsync()
					.then((response) => {
						console.log('✅ 주기적 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken, // 새로운 토큰 존재 여부
							시간: new Date().toLocaleString('ko-KR'), // 현재 시간
						});
					})
					.catch((error) => {
						console.error('❌ 주기적 토큰 갱신 실패:', {
							에러: error,
							시간: new Date().toLocaleString('ko-KR'),
						});
					});
				return;
			}

			const currentTime = Date.now() / 1000; // 현재 시간
			const timeUntilExpiration = (currentExpirationTime - currentTime) * 1000; // 토큰 만료 시간

			if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
				console.log('🔄 주기적 토큰 갱신 시도 중...');
				refreshAsync() // 토큰 갱신 요청
					.then((response) => {
						console.log('✅ 주기적 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken, // 새로운 토큰 존재 여부
							시간: new Date().toLocaleString('ko-KR'), // 현재 시간
						});
					})
					.catch((error) => {
						console.error('❌ 주기적 토큰 갱신 실패:', {
							에러: error,
							시간: new Date().toLocaleString('ko-KR'),
						});
					});
			}
		}, 30000); // 30초마다 체크

		return () => {
			clearInterval(intervalId);
		};
	}, [accessToken, refreshAsync]);
};
