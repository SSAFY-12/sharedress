import { ClothItem } from '@/components/cards/cloth-card';
import { useState } from 'react';
import SubTabNavigation from './SubTabNavigation';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useNavigate } from 'react-router-dom';
import { useCoordinationList } from '@/features/closet/hooks/useCoordinationList';
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

interface CodiTabProps {
	memberId: number;
}

const CodiTab = ({ memberId }: CodiTabProps) => {
	const [activeSubTab, setActiveSubTab] = useState<'my' | 'friends'>('my');
	const navigate = useNavigate();
	const scope = activeSubTab === 'my' ? 'CREATED' : 'RECOMMENDED';
	const { data: coordinationList = [] } = useCoordinationList(memberId, scope);

	const items: ClothItem[] = coordinationList.map((coordi) => ({
		id: coordi.id.toString(),
		name: coordi.description,
		category: activeSubTab === 'my' ? '나의 코디' : '친구의 추천',
		imageUrl: coordi.items[0].image ?? 'https://picsum.photos/200',
	}));

	const handleItemClick = (item: ClothItem) => {
		navigate(`/codi/${item.id}`);
	};

	return (
		<div className='p-4'>
			<SubTabNavigation
				tabs={CodiTabs}
				activeTab={activeSubTab}
				onTabChange={setActiveSubTab}
				className='mb-6'
			/>
			<ClothListContainer
				items={items}
				onItemClick={handleItemClick}
				columns={2}
			/>
		</div>
	);
};

export default CodiTab;
