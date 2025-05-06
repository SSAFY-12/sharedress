import React, { useState } from 'react';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { categoryConst } from '@/constants/categoryConfig';
import { SearchBar } from '@/components/inputs/search-bar';

const LibraryContainer = () => {
	const [selectedCategory, setSelectedCategory] = useState<
		(typeof categoryConst)[number]
	>(categoryConst[0]);
	const [value, setValue] = useState('');
	const [items] = useState<ClothItem[]>([]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category as (typeof categoryConst)[number]);
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
				categories={categoryConst}
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
