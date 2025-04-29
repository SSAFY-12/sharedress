import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
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
				path: 'friend',
				element: <FriendPage />,
			},
		],
	},
]);
