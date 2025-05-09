import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '@/features/closet/hooks/useCloset';
interface ClosetTabProps {
	memberId: number;
	selectedCategory: string;
	setSelectedCategory: (value: string) => void;
}

const CATEGORIES = ['전체', '아우터', '상의', '하의', '신발', '기타'];

const ClosetTab = ({
	memberId,
	selectedCategory,
	setSelectedCategory,
}: ClosetTabProps) => {
	const navigate = useNavigate();

	const categoryId =
		selectedCategory === '전체'
			? undefined
			: CATEGORIES.indexOf(selectedCategory);

	const { data: items } = useCloset(memberId, categoryId);

	const handleItemClick = (item: ClothItem) => {
		navigate(`/cloth/${parseInt(item.id)}`);
	};

	return (
		<div className='flex flex-col h-full'>
			{/* <div className='px-4 shrink-0'>
				<ItemCategoryBar
					categories={CATEGORIES}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
				/>
			</div> */}

			<div className='flex-1 overflow-y-auto scrollbar-hide px-4'>
				<ClothListContainer
					items={
						items?.map((item) => ({
							id: item.id.toString(),
							category: selectedCategory,
							imageUrl: item.image,
							name: item.name,
							brand: item.brandName,
						})) ?? []
					}
					categories={CATEGORIES}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
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
