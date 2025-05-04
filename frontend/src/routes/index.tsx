import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/App';
import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import AuthPage from '@/pages/AuthPage';
import FriendPage from '@/pages/social/FriendPage';
// import { FriendSearchResultPage } from '@/features/social/pages/FriendSearchResultPage';
// import { FriendsListPage } from '@/features/social/pages/FriendListPage';
// import { FriendRequestsPage } from '@/features/social/pages/FriendRequestPage';
import CodiEditPage from '@/features/codi/pages/CodiEditPage';
import FriendAddPage from '@/pages/social/FriendAddPage';

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
