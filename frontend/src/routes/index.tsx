import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/App';
import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import AuthPage from '@/pages/AuthPage';
import MyClosetPage from '@/features/closet/pages/MyClosetPage';
import ClothDetailPage from '@/features/closet/pages/ClothDetailPage';
import SocialPage from '@/pages/SocialPage';
import GoogleCallbackHandler from '@/features/auth/pages/GoogleCallbackHandler';
import CodiDetailPage from '@/features/closet/pages/CodiDetailPage';
import RegistPage from '@/pages/RegistPage';
import CodiCreatePage from '@/features/codi/pages/CodiCreatePage';
export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Navigate to='/wardrobe' replace />,
				// 초기 세팅값 wardrobe
			},
			// {
			// 	path: 'auth',
			// 	element: <AuthPage />,
			// },
			{
				path: 'wardrobe',
				element: <WardrobePage />,
			},
			{
				path: 'codi',
				element: <CodiPage />,
			},
			{
				path: 'codi/create',
				element: <CodiCreatePage />,
			},
			{
				path: 'friend',
				element: <SocialPage />,
			},
			{
				path: 'regist/*',
				element: <RegistPage />,
			},
			{
				path: '*',
				element: <Navigate to='/wardrobe' replace />,
			},
		],
	},
	{
		path: 'mypage',
		element: <MyClosetPage />,
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
		path: 'cloth/:id',
		element: <ClothDetailPage />,
	},
	{
		path: 'codi/:id',
		element: <CodiDetailPage />,
	},
]);
