import { useEffect, useState } from 'react';
import ProfileHeader from '@/features/closet/components/ProfileHeader';
import ClosetTab from '@/features/closet/components/ClosetTab';
import { useMyProfile } from '@/features/closet/hooks/useMyProfile';
import { useLocation } from 'react-router-dom';
import SelectMenu from '@/components/menu/two-selection-menu/SelectMenu';
import ItemCategoryBar from '@/components/etc/ItemCategoryBar';
import { categoryConfig } from '@/constants/categoryConfig';
import UnifiedCodiTab from '@/features/closet/components/UnifiedCodiTab';
import SubTabNavigation from '@/features/closet/components/SubTabNavigation';

const closetTab = ['옷장', '코디'];
const CodiTabs = [
	{
		id: 'my' as const,
		label: '나의 코디',
	},
	{
		id: 'friendspick' as const,
		label: '친구의 추천',
	},
];

const MyClosetPage = () => {
	const location = useLocation();
	const initialTab =
		(location.state?.initialTab as (typeof closetTab)[number]) ?? '옷장';
	const initialSubTab =
		(location.state?.initialSubTab as 'my' | 'friendspick') ?? 'my';

	// 상태 관리
	const [activeMainTab, setActiveMainTab] = useState<
		(typeof closetTab)[number]
	>(initialTab ?? '옷장');
	const [selectedCategory, setSelectedCategory] = useState(categoryConfig[0]);
	const [activeSubTab, setActiveSubTab] = useState<'my' | 'friendspick'>(
		initialSubTab,
	);

	console.log('activeSubTab:', activeSubTab);

	useEffect(() => {
		if (initialTab === '코디') {
			setActiveSubTab(initialSubTab);
		}
	}, [initialTab, initialSubTab]);

	useEffect(() => {
		if (activeMainTab === '옷장') {
			setSelectedCategory(categoryConfig[0]);
		}
	}, [activeMainTab]);

	const { data: profile } = useMyProfile();

	return (
		<div className='flex flex-col h-screen overflow-y-auto bg-white w-full scrollbar-hide'>
			<div className='relative'>
				<ProfileHeader
					profileImage={profile?.profileImage}
					nickname={profile?.nickname}
					code={profile?.code}
					statusMessage={profile?.oneLiner}
					isMe={true}
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
						memberId={profile?.id ?? 0}
						selectedCategory={selectedCategory}
						isMe={true}
					/>
				) : (
					<UnifiedCodiTab
						memberId={profile?.id ?? 0}
						activeSubTab={activeSubTab}
						isMe={true}
					/>
				)}
			</div>

			{/* 하단 컴포넌트 */}
			{/* <div className='flex-1 overflow-y-auto scrollbar-hide'>
				{activeMainTab === '옷장' ? (
					<ClosetTab
						memberId={profile?.id ?? 0}
						selectedCategory={selectedCategory}
					/>
				) : (
					<CodiTab memberId={profile?.id ?? 0} />
				)}
			</div> */}
		</div>
	);
};

export default MyClosetPage;
