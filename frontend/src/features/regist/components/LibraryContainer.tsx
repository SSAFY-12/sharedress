import React, { useEffect, useRef, useState } from 'react';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { categoryConfig } from '@/constants/categoryConfig';
import { SearchBar } from '@/components/inputs/search-bar';
import { categoryMapping } from '@/constants/categoryConfig';
import {
	RegistApis,
	Clothes,
	ClothesRequestParams,
	ClothesResponse,
} from '@/features/regist/api/registApis';
import { useInfiniteQuery } from '@tanstack/react-query';

const LibraryContainer = () => {
	const [selectedCategory, setSelectedCategory] = useState<
		(typeof categoryConfig)[number]
	>(categoryConfig[0]);
	const [value, setValue] = useState('');

	const { data, isFetchingNextPage, hasNextPage, fetchNextPage, isPending } =
		useInfiniteQuery<ClothesResponse>({
			queryKey: ['clothes', selectedCategory, value.trim()],
			queryFn: async ({ pageParam }) => {
				const request = {
					size: 12,
					keyword: value || undefined,
					categoryIds:
						selectedCategory === '전체'
							? undefined
							: categoryMapping[selectedCategory],
				};
				const response = await RegistApis.getClothes({
					...request,
					cursor: pageParam as number | undefined,
				});
				console.log('API 요청:', request);
				console.log('API 응답:', response);
				return response;
			},
			getNextPageParam: (lastPage) => lastPage.pagination.cursor ?? undefined,
			initialPageParam: undefined,
			staleTime: 1000 * 5, // 5초 내엔 refetch 안 함
			placeholderData: () => ({
				pages: [],
				pageParams: [],
			}),
		});

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

	const sentinel = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!sentinel.current) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ root: null, threshold: 0.1 },
		);
		io.observe(sentinel.current);
		return () => io.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const allItems =
		data?.pages.flatMap((page: ClothesResponse) =>
			page.content.map((item: Clothes) => ({
				id: item.id,
				name: item.name,
				imageUrl: item.image,
				brand: item.brandName,
			})),
		) || [];

	return (
		<div className='flex flex-col gap-2 w-full items-center'>
			<SearchBar
				placeholder='검색'
				value={value}
				onChange={handleChange}
				onSubmit={handleSubmit}
				className='sticky top-20 z-10'
			/>
			{isPending ? (
				<div>로딩 중...</div>
			) : (
				<div className='w-full '>
					<ClothListContainer
						isForRegist={true}
						categories={categoryConfig}
						items={allItems as ClothItem[]}
						selectedCategory={selectedCategory}
						onCategoryChange={handleCategoryChange}
						onItemClick={handleItemClick}
						className='flex flex-col w-full gap-4'
					/>
					<div ref={sentinel} className='h-1' />
					{isFetchingNextPage && <div>추가 로딩 중...</div>}
				</div>
			)}
		</div>
	);
};

export default LibraryContainer;
