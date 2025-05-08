import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface AuthState {
	accessToken: string | null;
	isAuthenticated: boolean;
	setAccessToken: (token: string | null) => void;
	logout: () => void;
	clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist<AuthState>(
		(set) => ({
			accessToken: null,
			isAuthenticated: false,
			setAccessToken: (token) => {
				console.log('🔑 setAccessToken 호출됨:', {
					토큰존재: !!token,
					시간: new Date().toLocaleString('ko-KR'),
				});
				set({ accessToken: token, isAuthenticated: !!token });
			},
			logout: () => {
				console.log('🚪 로그아웃 호출됨:', {
					시간: new Date().toLocaleString('ko-KR'),
				});
				toast.info('로그아웃되었습니다.');
				set({
					accessToken: null,
					isAuthenticated: false,
				});
				// 로컬 스토리지의 모든 인증 관련 데이터 삭제
				localStorage.removeItem('auth-storage');
				localStorage.removeItem('마지막갱신');
			},
			clearAuth: () => {
				console.log('🧹 clearAuth 호출됨:', {
					시간: new Date().toLocaleString('ko-KR'),
				});
				set({ accessToken: null, isAuthenticated: false });
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({ ...state }),
			// 토큰이 변경될 때마다 로컬 스토리지 업데이트
			onRehydrateStorage: () => (state) => {
				console.log('🔄 Auth state rehydrated:', {
					토큰존재: !!state?.accessToken,
					시간: new Date().toLocaleString('ko-KR'),
				});
			},
		},
	),
);
