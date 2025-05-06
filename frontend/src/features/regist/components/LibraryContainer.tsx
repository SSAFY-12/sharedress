import React, { useState, useEffect } from 'react';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { categoryConfig } from '@/constants/categoryConfig';
import { SearchBar } from '@/components/inputs/search-bar';
import { RegistApis, Clothes } from '@/features/regist/api/registApis';

// 카테고리 매핑
const categoryMapping: { [key: string]: string } = {
	전체: '0',
	아우터: '1',
	상의: '2',
	하의: '3',
	신발: '4',
	악세사리: '5',
};

const LibraryContainer = () => {
	const [selectedCategory, setSelectedCategory] = useState<
		(typeof categoryConfig)[number]
	>(categoryConfig[0]);
	const [value, setValue] = useState('');
	const [items, setItems] = useState<ClothItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchClothes = async () => {
			try {
				setIsLoading(true);
				const response = await RegistApis.getClothes({
					size: 12,
					keyword: value || undefined,
					categoryIds:
						selectedCategory === '전체'
							? undefined
							: categoryMapping[selectedCategory],
				});

				// API 응답 데이터를 ClothItem 형식으로 변환
				const transformedItems: ClothItem[] = response.content.map(
					(item: Clothes) => ({
						id: item.id.toString(),
						name: item.name,
						category: selectedCategory,
						imageUrl: item.image,
						brand: item.brandName,
					}),
				);

				setItems(transformedItems);
			} catch (error) {
				console.error('옷장 데이터를 불러오는데 실패했습니다:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchClothes();
	}, [selectedCategory, value]);

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
			{isLoading ? (
				<div>로딩 중...</div>
			) : (
				<ClothListContainer
					isForRegist={true}
					categories={categoryConfig}
					items={items}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
					onItemClick={handleItemClick}
					className='flex flex-col w-full gap-4'
				/>
			)}
		</div>
	);
};

export default LibraryContainer;
