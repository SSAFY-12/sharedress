import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useNavigate } from 'react-router-dom';
import { useCoordinationList } from '@/features/closet/hooks/useCoordinationList';
import { useRecommendedToFriend } from '@/features/closet/hooks/useRecommendedToFriend';

interface FriendCodiTabProps {
	memberId: number;
	activeSubTab: 'friends' | 'recommended';
	setActiveSubTab: (value: 'friends' | 'recommended') => void;
}

const FriendCodiTab = ({ memberId, activeSubTab }: FriendCodiTabProps) => {
	const navigate = useNavigate();
	const isMe = false;
	const { data: friendsCoordis = [] } = useCoordinationList(
		memberId,
		'CREATED',
	);
	const { data: recommendedCoordis = [] } = useRecommendedToFriend(memberId);

	const coordis =
		activeSubTab === 'friends' ? friendsCoordis : recommendedCoordis;

	const visibleCoordis = coordis.filter((c) => isMe || c.isPublic);

	const items: ClothItem[] = visibleCoordis.map((coordi) => ({
		id: coordi.id,
		name: coordi.description,
		category: activeSubTab === 'friends' ? '친구의 코디' : '내가 추천한 코디',
		imageUrl: coordi.thumbnail || 'https://picsum.photos/200',
		isPublic: coordi.isPublic,
	}));

	const handleItemClick = (item: ClothItem) => {
		navigate(`/codi/${item.id}`, {
			state: { isMe: false, source: activeSubTab, ownerId: memberId },
		});
	};

	return (
		<div className='px-4 flex flex-col flex-1'>
			{items.length === 0 ? (
				<div className='flex-1 flex items-center justify-center text-description text-descriptionColor'>
					{activeSubTab === 'friends'
						? '저장한 코디가 없습니다'
						: '내가 추천한 코디가 없습니다'}
				</div>
			) : (
				<ClothListContainer
					items={items}
					onItemClick={handleItemClick}
					columns={2}
					type='codi'
				/>
			)}
		</div>
	);
};

export default FriendCodiTab;
