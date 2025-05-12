import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useNavigate } from 'react-router-dom';
import { useCoordinationList } from '@/features/closet/hooks/useCoordinationList';

interface CodiTabProps {
	memberId: number;
	activeSubTab: 'my' | 'friends';
	setActiveSubTab: (value: 'my' | 'friends') => void;
}

const CodiTab = ({ memberId, activeSubTab }: CodiTabProps) => {
	const navigate = useNavigate();
	const isMe = true;
	const scope = activeSubTab === 'my' ? 'CREATED' : 'RECOMMENDED';
	const { data: coordinationList = [] } = useCoordinationList(memberId, scope);

	const visibleCoordis = coordinationList.filter((c) => isMe || c.isPublic);

	const items: ClothItem[] = visibleCoordis.map((coordi) => ({
		id: coordi.id,
		name: coordi.description,
		category: activeSubTab === 'my' ? '나의 코디' : '친구의 추천',
		imageUrl: coordi.thumbnail || 'https://picsum.photos/200',
		isPublic: coordi.isPublic,
	}));

	const handleItemClick = (item: ClothItem) => {
		navigate(`/codi/${item.id}`, {
			state: { isMe: true },
		});
	};

	return (
		<div className='px-4'>
			<ClothListContainer
				items={items}
				onItemClick={handleItemClick}
				columns={2}
				type='codi'
			/>
		</div>
	);
};

export default CodiTab;
