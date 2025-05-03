// import { Outlet } from 'react-router-dom';
// import { FriendSearchResultPage } from '@/features/social/pages/FriendSearchResultPage';
// import FriendSearchPage from '@/features/social/pages/FriendSearchPage';
import { FriendsListPage } from '@/features/social/pages/FriendListPage';

// import { FriendRequestsPage } from '@/features/social/pages/FriendRequestPage';

const SocialPage = () => (
	<div>
		{/* <FriendSearchPage /> */}
		{/* <FriendSearchResultPage /> */}
		<FriendsListPage />
		{/* <FriendRequestsPage /> */}

		{/* 하위 라우트의 컴포넌트가 여기에 렌더링됩니다 */}
		{/* <Outlet /> */}
	</div>
);

export default SocialPage;
