import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/App';
import WardrobePage from '@/pages/WardrobePage';
import CodiPage from '@/pages/CodiPage';
import AuthPage from '@/pages/AuthPage';
import SocialPage from '@/pages/SocialPage';
// import { FriendSearchResultPage } from '@/features/social/pages/FriendSearchResultPage';
// import { FriendsListPage } from '@/features/social/pages/FriendListPage';
// import { FriendRequestsPage } from '@/features/social/pages/FriendRequestPage';
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
				element: <SocialPage />,
				// children: [
				// 	{
				// 		path: 'search',
				// 		element: <FriendSearchResultPage />,
				// 	},
				// 	// {
				// 	// 	path: 'list',
				// 	// 	element: <FriendsListPage />,
				// 	// },
				// 	{
				// 		path: 'request',
				// 		element: <FriendRequestsPage />,
				// 	},
				// ],
			},
			{
				path: '*',
				element: <Navigate to='/wardrobe' replace />,
			},
		],
	},
]);
