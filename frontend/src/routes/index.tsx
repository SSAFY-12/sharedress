import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/App';
import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import AuthPage from '@/pages/AuthPage';
import SocialPage from '@/pages/SocialPage';
import GoogleCallbackHandler from '@/features/auth/pages/GoogleCallbackHandler';
import CodiEditPage from '@/features/codi/pages/CodiEditPage';
import CodiSavePage from '@/features/codi/pages/CodiSavePage';

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
				path: 'friend',
				element: <SocialPage />,
			},
			{
				path: '*',
				element: <Navigate to='/wardrobe' replace />,
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
		path: 'codi/edit',
		element: <CodiEditPage />,
	},
	{
		path: 'codi/save',
		element: <CodiSavePage />,
	},
]);
