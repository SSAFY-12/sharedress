import { Outlet } from 'react-router-dom';
import { FriendsListPage } from '@/features/social/pages/FriendListPage';
// import { FriendSearchResultPage } from '@/features/social/pages/FriendSearchResultPage';
// import FriendSearchPage from '@/features/social/pages/FriendSearchPage';

// import { FriendRequestsPage } from '@/features/social/pages/FriendRequestPage';

const SocialPage = () => (
	<div>
		<FriendsListPage />
		{/* 하위 children 라우트 컴포넌트가 여기에 렌더링됨 */}
		<Outlet />
	</div>
);

export default SocialPage;
