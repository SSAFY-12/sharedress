import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/App';
import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import FriendPage from '@/pages/FriendPage';
import AuthPage from '@/pages/AuthPage';

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
				element: <FriendPage />,
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
]);
