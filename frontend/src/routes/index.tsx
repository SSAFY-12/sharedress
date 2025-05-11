import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import AuthPage from '@/pages/AuthPage';
import FriendAddPage from '@/pages/social/FriendAddPage';
import FriendRequestListPage from '@/pages/social/FriendRequestListPage';
import { App } from '@/App';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MyClosetPage from '@/features/closet/pages/MyClosetPage';
import ClothDetailPage from '@/features/closet/pages/ClothDetailPage';
import GoogleCallbackHandler from '@/features/auth/pages/GoogleCallbackHandler';
import CodiDetailPage from '@/features/closet/pages/CodiDetailPage';
import RegistPage from '@/pages/RegistPage';
import CodiSavePage from '@/features/codi/pages/CodiSavePage';
import FriendPage from '@/pages/social/FriendPage';
import CodiEditPage from '@/features/codi/pages/CodiEditPage';
import ClothEditPage from '@/features/closet/pages/ClothEditPage';
import FriendClosetPage from '@/features/closet/pages/FriendClosetPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				// element: <Navigate to='/wardrobe' />,
				element: <Navigate to='/wardrobe' />,
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
				path: 'social',
				// element: <SocialPage />,
				element: <FriendPage />,
			},
			{
				path: 'social/add',
				element: <FriendAddPage />,
			},
			{
				path: 'regist/*',
				element: <RegistPage />,
			},
			{
				path: '*',
				element: <Navigate to='/wardrobe' replace />,
			},
			{
				path: 'social/request',
				element: <FriendRequestListPage />,
			},
			// {
			// 	path: '*',
			// 	element: <Navigate to='/wardrobe' replace />,
			// },
			{
				path: 'mypage',
				element: <MyClosetPage />,
			},
			{
				path: 'friend/:id',
				element: <FriendClosetPage />,
			},
			{
				path: 'cloth/:id',
				element: <ClothDetailPage />,
			},
			{
				path: 'codi/:id',
				element: <CodiDetailPage />,
			},
			{
				path: 'cloth/:id/edit',
				element: <ClothEditPage />,
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
		path: '/codi/edit',
		element: <CodiEditPage />,
	},
	{
		path: '/codi/save',
		element: <CodiSavePage />,
	},
]);
