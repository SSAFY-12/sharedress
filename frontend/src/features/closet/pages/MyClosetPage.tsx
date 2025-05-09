import { useState } from 'react';
import ProfileHeader from '@/features/closet/components/ProfileHeader';
import ClosetTab from '@/features/closet/components/ClosetTab';
import CodiTab from '@/features/closet/components/CodiTab';
import { useMyProfile } from '@/features/closet/hooks/useMyProfile';
import { useLocation } from 'react-router-dom';
import SelectMenu from '@/components/menu/two-selection-menu/SelectMenu';

const closetTab = ['옷장', '코디'];

const MyClosetPage = () => {
	const location = useLocation();
	const initialTab =
		(location.state?.initialTab as (typeof closetTab)[number]) ?? '옷장';

	// 상태 관리
	const [activeMainTab, setActiveMainTab] = useState<
		(typeof closetTab)[number]
	>(initialTab ?? '옷장');
	const { data: profile } = useMyProfile();

	return (
		<div className='flex flex-col h-screen overflow-hidden bg-white w-full'>
			<div className='shrink-0'>
				<div className='relative'>
					<ProfileHeader
						profileImage={profile?.profileImage}
						nickname={profile?.nickname}
						code={profile?.code}
						statusMessage={profile?.oneLiner}
					/>
					{/* 자연스러운 그라데이션 효과 */}
					<div
						className='absolute bottom-12 left-0 right-0 h-24 pointer-events-none'
						style={{
							background:
								'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.95) 80%, rgba(255,255,255,1) 100%)',
							transform: 'translateY(50%)',
							zIndex: 20,
						}}
					></div>
				</div>

				<div className='px-4'>
					<SelectMenu
						menu={closetTab}
						selected={activeMainTab}
						setSelected={setActiveMainTab}
					/>
				</div>
			</div>

			{/* 하단 컴포넌트 */}
			<div className='flex-1 overflow-y-auto scrollbar-hide'>
				{activeMainTab === '옷장' ? (
					<ClosetTab memberId={profile?.id ?? 0} />
				) : (
					<CodiTab memberId={profile?.id ?? 0} />
				)}
			</div>
		</div>
	);
};

export default MyClosetPage;
