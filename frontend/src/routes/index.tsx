import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
// import { AuthPage } from '@/pages/AuthPage';
// import { WardrobePage } from '@/pages/WardrobePage';
// import { CodiPage } from '@/pages/CodiPage';
// import { FriendPage } from '@/pages/FriendPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'auth',
				// element: <AuthPage />,
			},
			{
				path: 'wardrobe',
				// element: <WardrobePage />,
			},
			{
				path: 'codi',
				// element: <CodiPage />,
			},
			{
				path: 'friend',
				// element: <FriendPage />,
			},
		],
	},
]);
