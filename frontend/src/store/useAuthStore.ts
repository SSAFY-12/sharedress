import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
	accessToken: string | null;
	isAuthenticated: boolean;
	setAccessToken: (token: string | null) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
	persist<AuthStore>(
		(set) => ({
			accessToken: null,
			isAuthenticated: false,
			setAccessToken: (token) => {
				console.log('setAccessToken 호출됨', token);
				set({
					accessToken: token,
					isAuthenticated: !!token,
				});
			},
			logout: () =>
				set({
					accessToken: null,
					isAuthenticated: false,
				}),
		}),
		{
			name: 'auth-storage', // localStorage key
			partialize: (state) => ({ ...state }), // persist all fields
		},
	),
);
