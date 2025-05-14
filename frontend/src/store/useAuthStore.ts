import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/features/auth/api/authApi';

interface AuthState {
	accessToken: string | null; // 액세스 토큰
	isAuthenticated: boolean; // 인증 여부
	isInitialized: boolean; // 초기화 여부
	setAccessToken: (token: string | null) => void; // 액세스 토큰 설정
	logout: () => void; // 로그아웃
	clearAuth: () => void; // 인증 정보 초기화
	initializeAuth: () => Promise<void>; // 인증 정보 초기화
}

// 인증 상태 관리 스토어
export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			accessToken: null, // 액세스 토큰
			isAuthenticated: false, // 인증 여부
			isInitialized: false, // 초기화 여부
			setAccessToken: (token) => {
				set({ accessToken: token, isAuthenticated: !!token }); // 액세스 토큰 설정
			},
			logout: async () => {
				// 로그아웃 처리
				await showLogoutNotification();
				useAuthStore.getState().clearAuth();
				window.location.href = '/auth';
			},
			clearAuth: () => {
				// 인증 정보 초기화
				set({ accessToken: null, isAuthenticated: false });
			},
			// 앱이 시작될 때 인증 정보 초기화(처음 로드 될때, 페이지를 새로 고침 할 때) === 다시 로그인 하지 않게
			initializeAuth: async () => {
				try {
					// 이미 초기화되었다면 중복 실행 방지
					if (useAuthStore.getState().isInitialized) {
						return;
					}

					// 리프레시 토큰 존재 여부 확인
					const hasRefreshToken = document.cookie.includes('refreshToken');

					// 리프레시 토큰이 있는 경우에만 토큰 갱신 시도
					if (hasRefreshToken) {
						const response = await authApi.refresh();
						if (response.content.accessToken) {
							set({
								accessToken: response.content.accessToken,
								isAuthenticated: true,
								isInitialized: true,
							});
						} else {
							set({
								accessToken: null,
								isAuthenticated: false,
								isInitialized: true,
							});
						}
					} else {
						// 리프레시 토큰이 없는 경우 초기화만 수행
						set({
							accessToken: null,
							isAuthenticated: false,
							isInitialized: true,
						});
					}
				} catch (error) {
					set({
						accessToken: null,
						isAuthenticated: false,
						isInitialized: true,
					});
				}
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated,
				isInitialized: state.isInitialized,
			}),
		},
	),
);

const showLogoutNotification = async () => {
	if ('serviceWorker' in navigator && 'Notification' in window) {
		const registration = await navigator.serviceWorker.ready;
		await registration.showNotification('로그아웃', {
			body: '로그아웃되었습니다.',
			icon: '/android-chrome-192x192.png',
			badge: '/favicon-32x32.png',
		});
	}
};
