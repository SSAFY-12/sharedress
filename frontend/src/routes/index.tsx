import React from 'react';
// import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import ClothPage from '@/pages/ClothPage';
import AuthPage from '@/pages/AuthPage';
import { App } from '@/App';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import GoogleCallbackHandler from '@/features/auth/pages/GoogleCallbackHandler';
import RegistPage from '@/pages/RegistPage';
import NotificationPage from '@/pages/NotificationPage';
import FriendClosetPage from '@/features/closet/pages/FriendClosetPage';
import { useAuthStore } from '@/store/useAuthStore';
import FriendPage from '@/pages/FriendPage';
import CodiPublicEditPage from '@/features/closet/pages/CodiPublicEditPage';
import ExternalUserPage from '@/pages/ExternalUserPage';
import MyPage from '@/pages/MyPage';
import FriendClosetLayoutPage from '@/features/closet/pages/FriendClosetLayoutPage';

// 인증된 사용자만 접근 가능한 라우트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { accessToken } = useAuthStore();
	if (!accessToken) {
		return <Navigate to='/auth' replace />;
	}
	return <>{children}</>;
};

// 초기 라우트 컴포넌트
const InitialRoute = () => {
	const { accessToken } = useAuthStore();
	return <Navigate to={accessToken ? '/mypage' : '/auth'} replace />;
};

export const router = createBrowserRouter([
	// 공개 라우트
	{ path: '/auth', element: <AuthPage /> },
	{ path: '/oauth/google/callback', element: <GoogleCallbackHandler /> },
	{ path: '/link/:code', element: <ExternalUserPage /> },
	{ path: '/link/friend/:id', element: <FriendClosetLayoutPage /> }, // <-- App 없이 바로!

	// 인증 필요 라우트
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <InitialRoute />,
			},
			{
				path: 'social/*',
				element: (
					<ProtectedRoute>
						<FriendPage />
					</ProtectedRoute>
				),
			},
			{
				path: 'regist/*',
				element: (
					<ProtectedRoute>
						<RegistPage />
					</ProtectedRoute>
				),
			},
			{
				path: 'notification',
				element: (
					<ProtectedRoute>
						<NotificationPage />
					</ProtectedRoute>
				),
			},
			{
				path: 'mypage/*',
				element: (
					<ProtectedRoute>
						<MyPage />
					</ProtectedRoute>
				),
			},
			{
				path: 'friend/:id',
				element: (
					<ProtectedRoute>
						<FriendClosetPage />
					</ProtectedRoute>
				),
			},
			{
				path: 'cloth/*',
				element: (
					<ProtectedRoute>
						<ClothPage />
					</ProtectedRoute>
				),
			},
			{
				path: 'codi/*',
				element: (
					<ProtectedRoute>
						<CodiPage />
					</ProtectedRoute>
				),
			},
			{
				path: '/codi/:id/edit',
				element: (
					<ProtectedRoute>
						<CodiPublicEditPage />
					</ProtectedRoute>
				),
			},
			{
				path: '*',
				element: <Navigate to='/' replace />,
			},
		],
	},
]);
