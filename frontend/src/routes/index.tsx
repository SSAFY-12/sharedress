import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import AuthPage from '@/pages/AuthPage';
import FriendPage from '@/pages/social/FriendPage';
import CodiEditPage from '@/features/codi/pages/CodiEditPage';
import FriendAddPage from '@/pages/social/FriendAddPage';
import FriendRequestListPage from '@/pages/social/FriendRequestListPage';
import { App } from '@/App';
import { createBrowserRouter, Navigate } from 'react-router-dom';

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
			{
				path: 'auth',
				element: <AuthPage />,
			},
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
				// element: <FriendsListPage />,
				element: <FriendPage />,
			},
			{
				path: 'social/add',
				element: <FriendAddPage />,
			},
			{
				path: 'social/request',
				element: <FriendRequestListPage />,
			},
			{
				path: '*',
				element: <Navigate to='/wardrobe' replace />,
			},
		],
	},
	{
		path: 'codi/edit',
		element: <CodiEditPage />,
	},
]);
