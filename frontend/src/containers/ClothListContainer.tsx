import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothCard } from '@/components/cards/cloth-card/ClothCard';
import { ItemCategoryBtn } from '@/components/etc/item-category-btn/ItemCategoryBtn';
import { ClothCardRegist } from '@/features/regist/components/ClothCardRegist';
import { ForwardedRef, forwardRef } from 'react';
import { ClothCardRegistEmpty } from '@/features/regist/components/ClothCardRegistEmpty';

interface ClothListContainerProps {
	items: ClothItem[];
	categories?: string[];
	onItemClick?: (item: ClothItem) => void;
	onCategoryChange?: (category: string) => void;
	selectedCategory?: string;
	columns?: 2 | 3;
	className?: string;
	isForRegist?: boolean; // 옷 등록시 사용되는것인지 여부
	isLoading?: boolean; // 로딩 상태
	isFetching?: boolean; // 다음 페이지 로딩 상태
	isFetchingNextPage?: boolean; // 다음 페이지 로딩 상태
	scrollRef?: ForwardedRef<HTMLDivElement>;
}

const ClothListContainer = forwardRef<HTMLDivElement, ClothListContainerProps>(
	({
		items,
		categories = [],
		onItemClick,
		onCategoryChange,
		selectedCategory = '',
		columns = 3,
		className = '',
		isForRegist = false,
		isLoading = false,
		isFetching = false,
		isFetchingNextPage = false,
		scrollRef,
	}) => (
		<div className={`${className} flex flex-col h-full `}>
			{/* 고정된 헤더 영역 */}
			<div className='flex-none'>
				{/* ✅ 스크롤 + Fade 구조 */}
				<div className='relative w-full '>
					{/* Fade right */}
					<div className='pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10' />

					{/* 스크롤 가능한 영역 */}
					<div className='overflow-x-auto scrollbar-hide'>
						<div className='flex justify-start gap-1.5 min-w-max px-2 py-2.5'>
							{categories.map((category) => (
								<ItemCategoryBtn
									key={category}
									text={category}
									isActive={selectedCategory === category}
									onClick={() => onCategoryChange?.(category)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* 스크롤 가능한 컨텐츠 영역 */}
			<div className='flex-1 overflow-y-auto'>
				<div
					className={`grid w-full gap-x-2.5 gap-y-5 ${
						columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
					}`}
				>
					{(isLoading || isFetching) && !isFetchingNextPage ? (
						<>
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
						</>
					) : (
						items.map((item) =>
							!isForRegist ? (
								<ClothCard
									key={item.id}
									item={item}
									size={columns === 2 ? 'lg' : 'md'}
									onClick={() => onItemClick?.(item)}
									className='flex flex-col w-full gap-2.5'
								/>
							) : (
								<ClothCardRegist
									key={item.id}
									item={item}
									className='flex flex-col w-full gap-2.5 items-center'
								/>
							),
						)
					)}
					{isFetchingNextPage && (
						<>
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
						</>
					)}
				</div>
				<div className='h-20' />
				<div ref={scrollRef} className='h-1' />
			</div>
		</div>
	),
);

ClothListContainer.displayName = 'ClothListContainer';

export { ClothListContainer };
