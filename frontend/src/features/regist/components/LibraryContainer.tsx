import React, { useState } from 'react';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { categoryConfig } from '@/constants/categoryConfig';
import { SearchBar } from '@/components/inputs/search-bar';

const dummyItems: ClothItem[] = [
	{
		id: '1',
		name: '블랙 후드티',
		category: '상의',
		imageUrl:
			'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60',
		brand: '나이키',
	},
	{
		id: '2',
		name: '청바지',
		category: '하의',
		imageUrl:
			'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60',
		brand: '리바이스',
	},
	{
		id: '3',
		name: '화이트 스니커즈',
		category: '신발',
		imageUrl:
			'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60',
		brand: '아디다스',
	},
	{
		id: '4',
		name: '베이지 코트',
		category: '아우터',
		imageUrl:
			'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60',
		brand: 'ZARA',
	},
	{
		id: '5',
		name: '그레이 맨투맨',
		category: '상의',
		imageUrl:
			'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60',
		brand: '유니클로',
	},
	{
		id: '6',
		name: '검정 슬랙스',
		category: '하의',
		imageUrl:
			'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60',
		brand: 'H&M',
	},
];

const LibraryContainer = () => {
	const [selectedCategory, setSelectedCategory] = useState<
		(typeof categoryConfig)[number]
	>(categoryConfig[0]);
	const [value, setValue] = useState('');
	const [items] = useState<ClothItem[]>(dummyItems);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category as (typeof categoryConfig)[number]);
	};

	const handleItemClick = (item: ClothItem) => {
		console.log('선택된 아이템:', item);
	};

	return (
		<div className='flex flex-col gap-2 w-full items-center'>
			<SearchBar
				placeholder='검색'
				value={value}
				onChange={handleChange}
				onSubmit={handleSubmit}
			/>
			<ClothListContainer
				isForRegist={true}
				categories={categoryConfig}
				items={items}
				selectedCategory={selectedCategory}
				onCategoryChange={handleCategoryChange}
				onItemClick={handleItemClick}
				className='flex flex-col w-full gap-4'
			/>
		</div>
	);
};

export default LibraryContainer;
