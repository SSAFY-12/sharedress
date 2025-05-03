import { ClothItem } from '@/components/cards/cloth-card';
import { useState } from 'react';
import SubTabNavigation from './SubTabNavigation';
import { ClothListContainer } from '@/containers/ClothListContainer';

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

// 코디 아이템 데이터
const myOutfits: ClothItem[] = [
	{
		id: '1',
		category: '나의 코디',
		name: '홍대 힙찔이 룩',
		imageUrl: 'https://picsum.photos/200',
	},
	{
		id: '2',
		category: '나의 코디',
		name: '성수 카페룩',
		imageUrl: 'https://picsum.photos/200',
	},
];

const friendsOutfits: ClothItem[] = [
	{
		id: '3',
		category: '친구의 추천',
		name: '데일리 캐주얼',
		imageUrl: 'https://picsum.photos/200',
	},
	{
		id: '4',
		category: '친구의 추천',
		name: '오피스 룩',
		imageUrl: 'https://picsum.photos/200',
	},
];

const CodiTab = () => {
	const [activeSubTab, setActiveSubTab] = useState<'my' | 'friends'>('my');

	const handleItemClick = (item: ClothItem) => {
		console.log('Outfit clicked:', item);
	};

	const displayItems = activeSubTab === 'my' ? myOutfits : friendsOutfits;

	return (
		<div className='p-4'>
			<SubTabNavigation
				tabs={CodiTabs}
				activeTab={activeSubTab}
				onTabChange={setActiveSubTab}
				className='mb-6'
			/>
			<ClothListContainer
				items={displayItems}
				onItemClick={handleItemClick}
				columns={2}
			/>
		</div>
	);
};

export default CodiTab;
