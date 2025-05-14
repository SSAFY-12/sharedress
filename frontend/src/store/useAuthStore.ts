import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { authApi } from '@/features/auth/api/authApi';

interface AuthState {
	accessToken: string | null; // 액세스 토큰
	isAuthenticated: boolean; // 인증 여부
	isInitialized: boolean; // 초기화 여부
	isGuest: boolean; // 게스트 여부
	setAccessToken: (token: string | null) => void; // 액세스 토큰 설정
	setIsGuest: (isGuest: boolean) => void; // 게스트 상태 설정 메서드 추가
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
			isGuest: false, // 초기값 false
			setAccessToken: (token) => {
				set({ accessToken: token, isAuthenticated: !!token }); // 액세스 토큰 설정
			},
			setIsGuest: (isGuest) => {
				set({ isGuest });
			},
			logout: () => {
				// 로그아웃 처리
				toast.info('로그아웃되었습니다.');
				useAuthStore.getState().clearAuth();
				window.location.href = '/auth';
			},
			clearAuth: () => {
				// 인증 정보 초기화
				set({ accessToken: null, isAuthenticated: false, isGuest: false });
			},
			// 앱이 시작될 때 인증 정보 초기화(처음 로드 될때, 페이지를 새로 고침 할 때) === 다시 로그인 하지 않게
			initializeAuth: async () => {
				try {
					if (useAuthStore.getState().isInitialized) {
						return;
					}

					// 게스트 토큰 확인
					const guestToken = document.cookie
						.split('; ')
						.find((row) => row.startsWith('guestToken='))
						?.split('=')[1];

					if (guestToken) {
						// 게스트 토큰이 있으면 게스트 상태로 설정
						set({
							accessToken: guestToken,
							isAuthenticated: true,
							isInitialized: true,
							isGuest: true,
						});
						return;
					}

					// 일반 사용자 토큰 처리
					const hasRefreshToken = document.cookie.includes('refreshToken');
					if (hasRefreshToken) {
						const response = await authApi.refresh();
						if (response.content.accessToken) {
							set({
								accessToken: response.content.accessToken,
								isAuthenticated: true,
								isInitialized: true,
								isGuest: false,
							});
						} else {
							set({
								accessToken: null,
								isAuthenticated: false,
								isInitialized: true,
								isGuest: false,
							});
						}
					} else {
						set({
							accessToken: null,
							isAuthenticated: false,
							isInitialized: true,
							isGuest: false,
						});
					}
				} catch (error) {
					set({
						accessToken: null,
						isAuthenticated: false,
						isInitialized: true,
						isGuest: false,
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
				isGuest: state.isGuest,
			}),
		},
	),
);
