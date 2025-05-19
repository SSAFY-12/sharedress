import { useNavigate } from 'react-router-dom';
import { useCoordinationList } from '@/features/closet/hooks/useCoordinationList';
import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

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
	const handleRecommendClick = () => {
		if (!memberId) return;

		navigate('/codi/edit', {
			state: {
				mode: 'recommended',
				targetMemberId: memberId.toString(),
			},
		});
	};

	const isGuest = useAuthStore((state) => state.isGuest);
	const navigate = useNavigate();
	console.log(activeSubTab);
	const { scope, label, emptyMessage } = tabInfoMap[activeSubTab];

	console.log(memberId, scope);
	const {
		data: coordinationList = [],
		isLoading,
		isFetching,
	} = useCoordinationList(memberId, scope);

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
		if (isGuest) {
			navigate(`/link/codi/${item.id}`, {
				state: {
					isMe,
					source: activeSubTab,
					...(isMe ? {} : { ownerId: memberId }),
				},
			});
		} else {
			navigate(`/codi/${item.id}`, {
				state: {
					isMe,
					source: activeSubTab,
					...(isMe ? {} : { ownerId: memberId }),
				},
			});
		}
	};

	const [randomText, setRandomText] = useState('');

	useEffect(() => {
		const textList = [
			'친구의 패션테러 진압 작전 개시  💣',
			'시켜줘, 너의 명예 스타일리스트  😎',
			'아픈 친구 옷장에 코디 처방전 주기  💊',
		];

		const randomText = textList[Math.floor(Math.random() * textList.length)];
		setRandomText(randomText);
	}, []);

	return (
		<div className='px-4 flex flex-col flex-1'>
			{!isMe && !isGuest && (
				<button
					className='flex justify-between items-center w-full bg-success/60 rounded-lg p-2 text-white pl-4 py-2 text-description mb-4'
					onClick={handleRecommendClick}
				>
					<span>{randomText}</span>
					<img
						src={'/icons/arrow_right_white.svg'}
						alt='arrow-right'
						className='w-6 h-6'
					/>
				</button>
			)}
			{items.length === 0 && !isFetching ? (
				<div className='flex-1 flex items-center justify-center text-description text-descriptionColor mt-12'>
					{emptyMessage}
				</div>
			) : (
				<>
					<ClothListContainer
						items={items}
						onItemClick={handleItemClick}
						columns={2}
						type='codi'
						isLoading={isLoading}
						isFetching={isFetching}
					/>
				</>
			)}
		</div>
	);
};

export default UnifiedCodiTab;
