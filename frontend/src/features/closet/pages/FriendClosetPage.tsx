import { useState } from 'react';
import ProfileHeader from '@/features/closet/components/ProfileHeader';
import ClosetTab from '@/features/closet/components/ClosetTab';
import { useLocation, useParams } from 'react-router-dom';
import SelectMenu from '@/components/menu/two-selection-menu/SelectMenu';
import ItemCategoryBar from '@/components/etc/ItemCategoryBar';
import { categoryConfig } from '@/constants/categoryConfig';

import SubTabNavigation from '@/features/closet/components/SubTabNavigation';
import { useFriendProfile } from '@/features/closet/hooks/useFriendProfile';
import UnifiedCodiTab from '@/features/closet/components/UnifiedCodiTab';
import { GuestModal } from '@/features/closet/components/GuestModal';

const closetTab = ['옷장', '코디'];
const CodiTabs = [
	{
		id: 'friends' as const,
		label: '친구의 코디',
	},
	{
		id: 'recommended' as const,
		label: '내가 추천한 코디',
	},
];

const FriendClosetPage = () => {
	const location = useLocation();
	const initialTab =
		(location.state?.initialTab as (typeof closetTab)[number]) ?? '옷장';
	const initialSubTab =
		(location.state?.initialSubTab as 'friends' | 'recommended') ?? 'friends';

	// 상태 관리
	const [activeMainTab, setActiveMainTab] = useState<
		(typeof closetTab)[number]
	>(initialTab ?? '옷장');
	const [selectedCategory, setSelectedCategory] = useState(categoryConfig[0]);
	const [activeSubTab, setActiveSubTab] = useState<'friends' | 'recommended'>(
		initialSubTab ?? 'friends',
	);

	// 모달 state 관리
	const [isModalOpen, setIsModalOpen] = useState(false);
	// 모달여는 함수
	const handleModalOpen = () => {
		setIsModalOpen(true);
		console.log('모달 열림');
	};

	const { id } = useParams();
	const memberId = Number(id);

	const { data: profile } = useFriendProfile(memberId);

	return (
		<div className='flex flex-col h-screen overflow-y-auto bg-white w-full scrollbar-hide'>
			<div className='relative'>
				<ProfileHeader
					profileImage={profile?.profileImage}
					nickname={profile?.nickname}
					code={profile?.code}
					statusMessage={profile?.oneLiner}
					isMe={false}
					memberId={memberId}
					handleModalOpen={handleModalOpen}
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

			<div className='px-4 sticky top-0 z-20 bg-white'>
				<SelectMenu
					menu={closetTab}
					selected={activeMainTab}
					setSelected={setActiveMainTab}
				/>
			</div>

			{/* sticky 하위 탭 */}
			<div className='px-4 sticky top-[48px] z-10 bg-white py-4'>
				{activeMainTab === '옷장' ? (
					<ItemCategoryBar
						categories={categoryConfig}
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
					/>
				) : (
					<SubTabNavigation
						tabs={CodiTabs}
						activeTab={activeSubTab}
						onTabChange={setActiveSubTab}
					/>
				)}
			</div>

			{/* 리스트 영역 */}
			<div className='pb-4'>
				{activeMainTab === '옷장' ? (
					<ClosetTab
						memberId={memberId}
						selectedCategory={selectedCategory}
						isMe={false}
					/>
				) : (
					<UnifiedCodiTab
						memberId={memberId}
						activeSubTab={activeSubTab}
						isMe={false}
					/>
				)}
			</div>
			{isModalOpen && (
				<GuestModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default FriendClosetPage;
