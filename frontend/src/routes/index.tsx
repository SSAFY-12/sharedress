import React from 'react';
// import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import ClothPage from '@/pages/ClothPage';
import AuthPage from '@/pages/AuthPage';
import { App } from '@/App';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MyClosetPage from '@/features/closet/pages/MyClosetPage';
import ClothDetailPage from '@/features/closet/pages/ClothDetailPage';
import GoogleCallbackHandler from '@/features/auth/pages/GoogleCallbackHandler';
import CodiDetailPage from '@/features/closet/pages/CodiDetailPage';
import RegistPage from '@/pages/RegistPage';
import CodiSavePage from '@/features/codi/pages/CodiSavePage';
import NotificationPage from '@/pages/NotificationPage';
import CodiEditPage from '@/features/codi/pages/CodiEditPage';
import ClothEditPage from '@/features/closet/pages/ClothEditPage';
import FriendClosetPage from '@/features/closet/pages/FriendClosetPage';
import { useAuthStore } from '@/store/useAuthStore';
import FriendPage from '@/pages/FriendPage';
import ExternalUserPage from '@/pages/ExternalUserPage';
import MyPage from '@/pages/MyPage';

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
				path: '*',
				element: <Navigate to='/' replace />,
			},
		],
	},
	{
		path: '/auth',
		element: <AuthPage />,
	},
	{
		path: '/oauth/google/callback',
		element: <GoogleCallbackHandler />,
	},
	{
		path: '/link/:code',
		element: <ExternalUserPage />,
	},
]);
