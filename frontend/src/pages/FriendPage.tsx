import { Route, Routes } from 'react-router-dom';
import { FriendsListPage } from '@/features/social/pages/FriendListPage';
import { FriendSearchResultPage } from '@/features/social/pages/FriendSearchResultPage';
import { FriendRequestsPage } from '@/features/social/pages/FriendRequestPage';
import { FriendCodiRequestPage } from '@/features/social/pages/FriendCodiRequestPage';
const FriendPage = () => (
	<Routes>
		<Route path='/' element={<FriendsListPage />} />
		<Route path='add' element={<FriendSearchResultPage />} />
		<Route path='request' element={<FriendRequestsPage />} />
		<Route path='codi-request' element={<FriendCodiRequestPage />} />
	</Routes>
);

export default FriendPage;
