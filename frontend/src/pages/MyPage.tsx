import { Route, Routes } from 'react-router-dom';

import MyClosetPage from '@/features/closet/pages/MyClosetPage';
import ProfileEditPage from '@/features/closet/pages/ProfileEditPage';
const MyPage = () => (
	<Routes>
		<Route path='/' element={<MyClosetPage />} />
		<Route path='edit' element={<ProfileEditPage />} />
	</Routes>
);

export default MyPage;
