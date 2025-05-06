import { useState } from 'react';
import ProfileHeader from '@/features/closet/components/ProfileHeader';
import MainTabNavigation from '@/features/closet/components/MainTabNavigation';
import ClosetTab from '@/features/closet/components/ClosetTab';
import CodiTab from '@/features/closet/components/CodiTab';
import NavBar from '@/components/layouts/NavBar';
import { useMyProfile } from '@/features/closet/hooks/useMyProfile';

const MyClosetPage = () => {
	// 상태 관리
	const [activeMainTab, setActiveMainTab] = useState<'closet' | 'codi'>(
		'closet',
	);
	const { data: profile } = useMyProfile();

	return (
		<div className='flex flex-col h-screen bg-white max-w-md mx-auto'>
			<ProfileHeader
				profileImage={profile?.profileImage}
				username={profile ? `${profile.nickname}#${profile.code}` : ''}
				statusMessage={profile?.oneLiner}
			/>

			<MainTabNavigation
				activeTab={activeMainTab}
				onTabChange={setActiveMainTab}
			/>

			{/* 하단 컴포넌트 */}
			<div className='flex-1 overflow-auto'>
				{activeMainTab === 'closet' ? (
					<ClosetTab memberId={profile?.id ?? 0} />
				) : (
					<CodiTab memberId={profile?.id ?? 0} />
				)}
			</div>

			<NavBar />
		</div>
	);
};

export default MyClosetPage;
