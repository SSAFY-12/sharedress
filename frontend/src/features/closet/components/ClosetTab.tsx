import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '@/features/closet/hooks/useCloset';

interface ClosetTabProps {
	memberId: number;
	selectedCategory: string;
	isMe: boolean;
}

// 카테고리 ID 매핑 (API 호출용)
const CATEGORY_ID_MAP: { [key: string]: number } = {
	아우터: 2,
	상의: 1,
	하의: 3,
	신발: 4,
	기타: 5,
};

const ClosetTab = ({ memberId, selectedCategory, isMe }: ClosetTabProps) => {
	const navigate = useNavigate();

	const categoryId =
		selectedCategory === '전체' ? undefined : CATEGORY_ID_MAP[selectedCategory];

	const { data: closetItems } = useCloset(memberId, categoryId);

	const visibleItems = (closetItems ?? []).filter(
		(item) => isMe || item.isPublic,
	);

	const handleItemClick = (item: ClothItem) => {
		navigate(`/cloth/${item.id}`, {
			state: { isMe, ownerId: memberId },
		});
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='flex-1 px-4'>
				<ClothListContainer
					items={
						visibleItems.map((item) => ({
							id: item.id,
							category: selectedCategory,
							imageUrl: item.image,
							name: item.name,
							brand: item.brandName,
							isPublic: item.isPublic,
						})) ?? []
					}
					onItemClick={handleItemClick}
					columns={3}
					className='mt-1'
					type='cloth'
				/>
			</div>
		</div>
	);
};

export default ClosetTab;
