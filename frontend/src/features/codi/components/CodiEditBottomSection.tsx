import { ClothListContainer } from '@/containers/ClothListContainer';
import CodiCategoryTabs from './CodiCategoryTabs';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { useEffect, useRef } from 'react';

interface Category {
	id: string;
	label: string;
}

interface CodiEditBottomSectionProps {
	categories: Category[];
	activeCategory: string;
	filteredProducts: ClothItem[];
	onCategoryChange: (category: string) => void;
	onItemClick: (item: ClothItem) => void;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	fetchNextPage?: () => void;
}

const CodiEditBottomSection = ({
	categories,
	activeCategory,
	filteredProducts,
	onCategoryChange,
	onItemClick,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: CodiEditBottomSectionProps) => {
	const sentinel = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!sentinel.current || !fetchNextPage) return;
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

	return (
		<div className='flex-1 flex flex-col min-h-0 bg-white border-t border-gray-100'>
			<div className='flex-shrink-0 px-4'>
				<CodiCategoryTabs
					categories={categories}
					activeCategory={activeCategory}
					onCategoryChange={onCategoryChange}
				/>
			</div>
			<div className='flex-1 overflow-y-auto scrollbar-hide border-t border-gray-200 mx-4'>
				<div className='px-0 py-4'>
					{filteredProducts.length > 0 ? (
						<ClothListContainer
							items={filteredProducts}
							onItemClick={onItemClick}
							type='cloth'
							scrollRef={sentinel}
							isFetchingNextPage={isFetchingNextPage}
						/>
					) : (
						<div className='flex flex-col items-center justify-center h-full'>
							<p className='text-center my-auto text-description text-descriptionColor'>
								옷이 없습니다!
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CodiEditBottomSection;
