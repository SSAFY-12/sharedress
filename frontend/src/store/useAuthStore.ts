import { authApi } from '@/features/auth/api/authApi';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
	accessToken: string | null;
	isGuest: boolean;
	isInitialized: boolean;
	setAccessToken: (token: string | null) => void;
	setIsGuest: (isGuest: boolean) => void;
	clearAuth: () => void;
	initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			accessToken: null,
			isGuest: false,
			isInitialized: false,
			setAccessToken: (token) => {
				set({ accessToken: token, isGuest: token ? false : true });
			},
			setIsGuest: (isGuest) => {
				if (useAuthStore.getState().accessToken) {
					set({ isGuest: false });
				} else {
					set({ isGuest });
				}
			},
			clearAuth: () => {
				// console.log('인증 정보 초기화');
				set({ accessToken: null, isGuest: true });
				// // localStorage에서 모든 관련 key 삭제
				// localStorage.removeItem('auth-store');
				// localStorage.removeItem('fcm-store');
				// localStorage.removeItem('profile-storage');
				// localStorage.removeItem('codiItems');
				// localStorage.removeItem('closet-storage');
			},
			initializeAuth: async () => {
				try {
					if (useAuthStore.getState().isInitialized) {
						return;
					}

					const hasRefreshToken = document.cookie.includes('refreshToken');
					// console.log('리프레시 토큰 존재 여부:', hasRefreshToken);

					if (hasRefreshToken) {
						const response = await authApi.refresh();
						if (response.content.accessToken) {
							// console.log('일반 사용자로 초기화');
							set({
								accessToken: response.content.accessToken,
								isGuest: false,
								isInitialized: true,
							});
						} else {
							// console.log('게스트로 초기화 (토큰 없음)');
							set({
								accessToken: null,
								isGuest: true,
								isInitialized: true,
							});
						}
					} else {
						// console.log('게스트로 초기화 (리프레시 토큰 없음)');
						set({
							accessToken: null,
							isGuest: true,
							isInitialized: true,
						});
					}
				} catch (error) {
					// console.log('게스트로 초기화 (에러 발생)');
					set({
						accessToken: null,
						isGuest: true,
						isInitialized: true,
					});
				}
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				accessToken: state.accessToken,
				isGuest: state.isGuest,
				isInitialized: state.isInitialized,
			}),
		},
	),
);

// const showLogoutNotification = async () => {
// 	if ('serviceWorker' in navigator && 'Notification' in window) {
// 		const registration = await navigator.serviceWorker.ready;
// 		await registration.showNotification('로그아웃', {
// 			body: '로그아웃되었습니다.',
// 			icon: '/new-android-chrome-192x192.png',
// 			badge: '/new-favicon-32x32.png',
// 		});
// 	}
// };
