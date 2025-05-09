import { useState } from 'react';
import ProfileHeader from '@/features/closet/components/ProfileHeader';
import ClosetTab from '@/features/closet/components/ClosetTab';
import CodiTab from '@/features/closet/components/CodiTab';
import { useMyProfile } from '@/features/closet/hooks/useMyProfile';
import { useLocation } from 'react-router-dom';
import SelectMenu from '@/components/menu/two-selection-menu/SelectMenu';
import ItemCategoryBar from '@/components/etc/ItemCategoryBar';
import SubTabNavigation from '../components/SubTabNavigation';

const closetTab = ['옷장', '코디'];
const CATEGORIES = ['전체', '아우터', '상의', '하의', '신발', '기타'];
const CodiTabs = [
	{
		id: 'my' as const,
		label: '나의 코디',
	},
	{
		id: 'friends' as const,
		label: '친구의 추천',
	},
];

const MyClosetPage = () => {
	const location = useLocation();
	const initialTab =
		(location.state?.initialTab as (typeof closetTab)[number]) ?? '옷장';

	// 상태 관리
	const [activeMainTab, setActiveMainTab] = useState<
		(typeof closetTab)[number]
	>(initialTab ?? '옷장');
	const [selectedCategory, setSelectedCategory] = useState('전체');
	const [activeSubTab, setActiveSubTab] = useState<'my' | 'friends'>('my');

	const { data: profile } = useMyProfile();

	return (
		<div className='flex flex-col h-screen overflow-y-auto bg-white w-full scrollbar-hide'>
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
						categories={CATEGORIES}
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
						setSelectedCategory={setSelectedCategory}
					/>
				) : (
					<CodiTab
						memberId={profile?.id ?? 0}
						activeSubTab={activeSubTab}
						setActiveSubTab={setActiveSubTab}
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
