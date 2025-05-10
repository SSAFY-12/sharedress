import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '@/features/closet/hooks/useCloset';

interface ClosetTabProps {
	memberId: number;
	selectedCategory: string;
}

const CATEGORIES = ['전체', '아우터', '상의', '하의', '신발', '기타'];

const ClosetTab = ({ memberId, selectedCategory }: ClosetTabProps) => {
	const navigate = useNavigate();

	const categoryId =
		selectedCategory === '전체'
			? undefined
			: CATEGORIES.indexOf(selectedCategory);

	const { data: closetItems } = useCloset(memberId, categoryId);

	const handleItemClick = (item: ClothItem) => {
		navigate(`/cloth/${item.id}`);
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='flex-1 px-4'>
				<ClothListContainer
					items={
						closetItems?.map((item) => ({
							id: item.id,
							category: selectedCategory,
							imageUrl: item.image,
							name: item.name,
							brand: item.brandName,
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
