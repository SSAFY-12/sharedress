import { useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import MainTabNavigation from '../components/MainTabNavigation';
import ClosetTab from '../components/ClosetTab';
import CodiTab from '../components/CodiTab';
import NavBar from '@/components/layouts/NavBar';

const MyClosetPage = () => {
	// 상태 관리
	const [activeMainTab, setActiveMainTab] = useState<'closet' | 'codi'>(
		'closet',
	);
	return (
		<div className='flex flex-col h-screen bg-white max-w-md mx-auto'>
			<ProfileHeader
				profileImage='https://picsum.photos/200'
				username='김현래#1324'
				statusMessage='자기소개입니다. 당신들은 안녕하신가.'
			/>

			<MainTabNavigation
				activeTab={activeMainTab}
				onTabChange={setActiveMainTab}
			/>

			{/* 하단 컴포넌트 */}
			<div className='flex-1 overflow-auto'>
				{activeMainTab === 'closet' ? <ClosetTab /> : <CodiTab />}
			</div>

			<NavBar />
		</div>
	);
};

export default MyClosetPage;
