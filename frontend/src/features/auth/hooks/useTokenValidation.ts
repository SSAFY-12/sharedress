import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTokenExpiration } from '@/features/auth/utils/tokenUtils';
import { useNavigate } from 'react-router-dom';
import useRefresh from './useRefresh';

const TOKEN_EXPIRATION_BUFFER = 3 * 60 * 1000; // 3분 버퍼

export const useTokenValidation = () => {
	// 토큰 상태 확인
	const { accessToken, isInitialized } = useAuthStore(); // 토큰 상태
	// 1. 사용자 정보 로드  / 2. 설정 로드 / 3. 기타 초기화 작업(초기화가 완료되기 전까지 로딩)
	// 필요한 데이터가 모두 로드된 이후에만 앱을 랜더링 (더 나은 사용자 경험 제공)

	const { mutateAsync: refreshAsync } = useRefresh(); // 토큰 갱신
	const navigate = useNavigate(); // 네비게이션

	useEffect(() => {
		// 1. 초기화 체크
		// 앱이 완전히 초기화되지 않았다면 토큰 검증을 하지 않음 : 앱의 기본 설정이 완료된 후에 토큰 검증
		// (다른 초기 설정들이 완료되지 않은 상태에서 토큰 검증을 하면 안됨)
		if (!isInitialized) {
			return;
		}

		// 2. 토큰 없음 체크
		// 액세스 토큰이 없는 경우 (로그인하지 않은 상태)
		if (!accessToken) {
			// 리프레시 토큰으로 새 액세스 토큰 발급 시도
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
					// 리프레시 토큰도 없는 경우 (쿠키에 없음) 로그인 페이지로 이동
					if (!document.cookie.includes('refreshToken')) {
						navigate('/auth');
					}
				});
			return;
		}

		// 3. 토큰 만료 시간 체크
		// JWT 토큰에서 만료 시간을 추출
		const expirationTime = getTokenExpiration(accessToken);
		if (!expirationTime) {
			// 만료 시간을 파싱할 수 없는 경우 새 토큰 발급 시도
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
					// 리프레시 토큰도 없는 경우 (쿠키에 없음) 로그인 페이지로 이동
					if (!document.cookie.includes('refreshToken')) {
						navigate('/auth');
					}
				});
			return;
		}

		// 4. 토큰 만료 시간 계산
		const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)
		const timeUntilExpiration = (expirationTime - currentTime) * 1000; // 만료까지 남은 시간 (밀리초 단위)

		// 5. 토큰 갱신 필요 여부 체크
		if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
			// 남은 시간이 버퍼 시간보다 작으면 토큰 갱신
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
					if (!document.cookie.includes('refreshToken')) {
						navigate('/auth');
					}
				});
		}

		// 6. 주기적 토큰 상태 확인 (30초마다)
		const intervalId = setInterval(() => {
			// 현재 토큰 상태 확인
			const currentToken = useAuthStore.getState().accessToken;

			// 토큰이 없어진 경우
			if (!currentToken) {
				refreshAsync()
					.then((response) => {
						console.log('✅ 주기적 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken,
							시간: new Date().toLocaleString('ko-KR'),
						});
					})
					.catch((error) => {
						console.error('❌ 주기적 토큰 갱신 실패:', {
							에러: error,
							시간: new Date().toLocaleString('ko-KR'),
						});
						if (!document.cookie.includes('refreshToken')) {
							navigate('/auth');
						}
					});
				return;
			}

			const currentExpirationTime = getTokenExpiration(currentToken);
			// 현재 토큰의 만료 시간
			if (!currentExpirationTime) {
				refreshAsync()
					.then((response) => {
						console.log('✅ 주기적 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken,
							시간: new Date().toLocaleString('ko-KR'),
						});
					})
					.catch((error) => {
						console.error('❌ 주기적 토큰 갱신 실패:', {
							에러: error,
							시간: new Date().toLocaleString('ko-KR'),
						});
						if (!document.cookie.includes('refreshToken')) {
							navigate('/auth');
						}
					});
				return;
			}

			// 주기적으로 만료 시간 체크
			const currentTime = Date.now() / 1000;
			const timeUntilExpiration = (currentExpirationTime - currentTime) * 1000;

			// 만료가 임박한 경우 갱신
			if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER) {
				refreshAsync()
					.then((response) => {
						console.log('✅ 주기적 토큰 갱신 성공:', {
							새토큰: !!response.content.accessToken,
							시간: new Date().toLocaleString('ko-KR'),
						});
					})
					.catch((error) => {
						console.error('❌ 주기적 토큰 갱신 실패:', {
							에러: error,
							시간: new Date().toLocaleString('ko-KR'),
						});
						// 리프레시 토큰도 없는 경우 (쿠키에 없음) 로그인 페이지로 이동
						if (!document.cookie.includes('refreshToken')) {
							navigate('/auth');
						}
					});
			}
		}, 30000); // 30초마다 체크 === 안정적 토큰 갱신

		// 7. 클린업 함수
		// 컴포넌트가 언마운트되거나 의존성이 변경될 때 인터벌 정리
		return () => {
			clearInterval(intervalId); // 인터벌 정리
		};
	}, [accessToken, refreshAsync, isInitialized, navigate]);
};
