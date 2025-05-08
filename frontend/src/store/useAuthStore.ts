import { create } from 'zustand';
import { toast } from 'react-toastify';
import { authApi } from '@/features/auth/api/authApi';

interface AuthState {
	accessToken: string | null;
	isAuthenticated: boolean;
	isInitialized: boolean;
	setAccessToken: (token: string | null) => void;
	logout: () => void;
	clearAuth: () => void;
	initializeAuth: () => Promise<void>;
}

// localStorage에서 토큰 복원
const getStoredToken = (): string | null => {
	try {
		return localStorage.getItem('accessToken');
	} catch (error) {
		console.error('토큰 복원 실패:', error);
		return null;
	}
};

export const useAuthStore = create<AuthState>()((set) => ({
	accessToken: getStoredToken(),
	isAuthenticated: !!getStoredToken(),
	isInitialized: false,
	setAccessToken: (token) => {
		console.log('🔑 setAccessToken 호출됨:', {
			토큰존재: !!token,
			시간: new Date().toLocaleString('ko-KR'),
		});

		if (token) {
			localStorage.setItem('accessToken', token);
		} else {
			localStorage.removeItem('accessToken');
		}

		set({ accessToken: token, isAuthenticated: !!token });
	},
	logout: () => {
		console.log('🚪 로그아웃 호출됨:', {
			시간: new Date().toLocaleString('ko-KR'),
		});
		toast.info('로그아웃되었습니다.');
		localStorage.removeItem('accessToken');
		set({
			accessToken: null,
			isAuthenticated: false,
		});
	},
	clearAuth: () => {
		console.log('🧹 clearAuth 호출됨:', {
			시간: new Date().toLocaleString('ko-KR'),
		});
		localStorage.removeItem('accessToken');
		set({ accessToken: null, isAuthenticated: false });
	},
	initializeAuth: async () => {
		try {
			// 이미 초기화되었다면 중복 실행 방지
			if (useAuthStore.getState().isInitialized) {
				return;
			}

			// 저장된 토큰이 있으면 먼저 설정
			const storedToken = getStoredToken();
			if (storedToken) {
				set({
					accessToken: storedToken,
					isAuthenticated: true,
				});
			}

			// 리프레시 토큰으로 새로운 토큰 발급 시도
			const response = await authApi.refresh();
			if (response.content.accessToken) {
				set({
					accessToken: response.content.accessToken,
					isAuthenticated: true,
					isInitialized: true,
				});
				console.log('🔄 토큰 자동 갱신 성공');
			}
		} catch (error) {
			console.log('❌ 토큰 자동 갱신 실패');
			set({
				accessToken: null,
				isAuthenticated: false,
				isInitialized: true,
			});
		}
	},
}));
