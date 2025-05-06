import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '../hooks/useCloset';

interface ClosetTabProps {
	memberId: number;
}

const CATEGORIES = ['전체', '아우터', '상의', '하의', '신발', '기타'];

const ClosetTab = ({ memberId }: ClosetTabProps) => {
	const navigate = useNavigate();
	// 상태 관리
	const [selectedCategory, setSelectedCategory] = useState('전체');

	const categoryId =
		selectedCategory === '전체'
			? undefined
			: CATEGORIES.indexOf(selectedCategory);

	const { data: items } = useCloset(memberId, categoryId);

	const handleItemClick = (item: ClothItem) => {
		navigate(`/cloth/${parseInt(item.id)}`);
	};

	return (
		<div className='p-4'>
			<ClothListContainer
				items={
					items?.map((item) => ({
						id: item.id.toString(),
						category: selectedCategory,
						imageUrl: item.image,
						name: item.name,
					})) ?? []
				}
				categories={CATEGORIES}
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
				onItemClick={handleItemClick}
				columns={3}
			/>
		</div>
	);
};

export default ClosetTab;
