import React, { useDeferredValue, useEffect, useRef, useState } from 'react';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { categoryConfig } from '@/constants/categoryConfig';
import { SearchBar } from '@/components/inputs/search-bar';
import { categoryMapping } from '@/constants/categoryConfig';
import {
	LibraryApis,
	LibraryClothes,
	LibraryResponse,
} from '@/features/regist/api/registApis';
import { useInfiniteQuery } from '@tanstack/react-query';
import ItemCategoryBar from '@/components/etc/ItemCategoryBar';

const LibraryContainer = () => {
	const [selectedCategory, setSelectedCategory] = useState<
		(typeof categoryConfig)[number]
	>(categoryConfig[0]);
	const [value, setValue] = useState('');
	const [debouncedValue, setDebouncedValue] = useState(value);
	const deferredValue = useDeferredValue(debouncedValue); // 검색어 랜더링 최적화

	// 디바운스 처리 - 검색어 입력후 200ms 뒤에 api 호출
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, 200);

		return () => clearTimeout(timer);
	}, [value]);

	const {
		data,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		isFetching,
		isLoading,
	} = useInfiniteQuery<LibraryResponse>({
		queryKey: ['clothes', selectedCategory, deferredValue.trim()],
		queryFn: async ({ pageParam }) => {
			const request = {
				size: 12,
				keyword: deferredValue || undefined,
				categoryId:
					selectedCategory === '전체'
						? undefined
						: categoryMapping[selectedCategory],
			};
			const response = await LibraryApis.getClothes({
				...request,
				cursor: pageParam as number | undefined,
			});

			return response;
		},
		getNextPageParam: (lastPage) => lastPage.pagination.cursor ?? undefined,
		initialPageParam: undefined,
		staleTime: 1000 * 5,
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
		data?.pages.flatMap((page: LibraryResponse) =>
			page.content.map((item: LibraryClothes) => ({
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
			/>
			<div className='w-full px-2 py-2.5 sticky top-[48px] z-10 bg-white'>
				<ItemCategoryBar
					categories={categoryConfig}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
				/>
			</div>
			<div className='w-full '>
				<ClothListContainer
					isForRegist={true}
					items={allItems as ClothItem[]}
					onItemClick={handleItemClick}
					className='flex flex-col w-full gap-4'
					scrollRef={sentinel}
					isLoading={isLoading}
					isFetching={isFetching}
					isFetchingNextPage={isFetchingNextPage}
					columns={2}
				/>
			</div>
		</div>
	);
};

export default LibraryContainer;
