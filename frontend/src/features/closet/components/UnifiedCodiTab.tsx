import { useNavigate } from 'react-router-dom';
import { useCoordinationList } from '../hooks/useCoordinationList';
import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';

interface UnifiedCodiTabProps {
	memberId: number;
	activeSubTab: 'my' | 'friendspick' | 'friends' | 'recommended';
	isMe: boolean;
}

const tabInfoMap = {
	my: {
		label: '나의 코디',
		scope: 'CREATED',
		emptyMessage: '저장한 코디가 없습니다',
	},
	friendspick: {
		label: '친구의 추천',
		scope: 'RECOMMENDED',
		emptyMessage: '추천 받은 코디가 없습니다',
	},
	friends: {
		scope: 'CREATED',
		label: '친구의 코디',
		emptyMessage: '저장한 코디가 없습니다',
	},
	recommended: {
		scope: 'RECOMMENDED',
		label: '내가 추천한 코디',
		emptyMessage: '내가 추천한 코디가 없습니다',
	},
} as const;

const UnifiedCodiTab = ({
	memberId,
	activeSubTab,
	isMe,
}: UnifiedCodiTabProps) => {
	const navigate = useNavigate();
	console.log(activeSubTab);
	const { scope, label, emptyMessage } = tabInfoMap[activeSubTab];

	console.log(memberId, scope);
	const { data: coordinationList = [] } = useCoordinationList(memberId, scope);

	console.log(coordinationList);

	const visibleCoordis = coordinationList.filter((c) => isMe || c.isPublic);

	const items: ClothItem[] = visibleCoordis.map((coordi) => ({
		id: coordi.id,
		name: coordi.description,
		category: label,
		imageUrl: coordi.thumbnail || 'https://picsum.photos/200',
		isPublic: coordi.isPublic,
	}));

	const handleItemClick = (item: ClothItem) => {
		navigate(`/codi/${item.id}`, {
			state: {
				isMe,
				source: activeSubTab,
				...(isMe ? {} : { ownerId: memberId }),
			},
		});
	};

	return (
		<div className='px-4 flex flex-col flex-1'>
			{items.length === 0 ? (
				<div className='flex-1 flex items-center justify-center text-description text-descriptionColor'>
					{emptyMessage}
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

export default UnifiedCodiTab;
