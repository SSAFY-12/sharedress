import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['전체', '아우터', '상의', '하의', '신발', '기타'];

const CLOTHING_ITEMS: ClothItem[] = [
	{
		id: '1',
		category: '상의',
		imageUrl: 'https://picsum.photos/200',
		name: '家に帰りたい',
	},
	{
		id: '2',
		category: '상의',
		imageUrl: 'https://picsum.photos/200',
		name: '비바스튜디오',
	},
	{
		id: '3',
		category: 'outer',
		imageUrl: 'https://picsum.photos/200',
		name: '세터',
	},
	{
		id: '4',
		category: '아우터',
		imageUrl: 'https://picsum.photos/200',
		name: '본트윈',
	},
	{
		id: '5',
		category: '상의',
		imageUrl: 'https://picsum.photos/200',
		name: '家に帰りたい',
	},
	{
		id: '6',
		category: '하의',
		imageUrl: 'https://picsum.photos/200',
		name: '아감',
	},
];

const ClosetTab = () => {
	const navigate = useNavigate();
	// 상태 관리
	const [selectedCategory, setSelectedCategory] = useState('전체');

	const filteredItems =
		selectedCategory === '전체'
			? CLOTHING_ITEMS
			: CLOTHING_ITEMS.filter((item) => item.category === selectedCategory);

	const handleItemClick = (item: ClothItem) => {
		navigate(`/cloth/${item.id}`);
	};

	return (
		<div className='p-4'>
			<ClothListContainer
				items={filteredItems}
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
