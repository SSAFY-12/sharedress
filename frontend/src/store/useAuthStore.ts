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
			setAccessToken: (token) => set({ accessToken: token }),
			setIsGuest: (isGuest) => set({ isGuest }),
			clearAuth: () => set({ accessToken: null, isGuest: false }),
			initializeAuth: async () => {
				try {
					if (useAuthStore.getState().isInitialized) {
						return;
					}

					const hasRefreshToken = document.cookie.includes('refreshToken');

					if (hasRefreshToken) {
						const response = await authApi.refresh();
						if (response.content.accessToken) {
							set({
								accessToken: response.content.accessToken,
								isGuest: false,
								isInitialized: true,
							});
						} else {
							set({
								accessToken: null,
								isGuest: true,
								isInitialized: true,
							});
						}
					} else {
						set({
							accessToken: null,
							isGuest: true,
							isInitialized: true,
						});
					}
				} catch (error) {
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
