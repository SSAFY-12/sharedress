import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { useEffect, useRef, useState } from 'react';
import CodiCategoryTabs from './CodiCategoryTabs';
import { ClothListContainer } from '@/containers/ClothListContainer';

interface Category {
	id: string;
	label: string;
}

interface CodiEditBottomAccordionProps {
	categories: Category[];
	activeCategory: string;
	filteredProducts: ClothItem[];
	onCategoryChange: (category: string) => void;
	onItemClick: (item: ClothItem) => void;
}

const CodiEditBottomAccordion = ({
	categories,
	activeCategory,
	filteredProducts,
	onCategoryChange,
	onItemClick,
}: CodiEditBottomAccordionProps) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			console.log(target);
			const isInside = containerRef.current?.contains(target);
			console.log(isInside);

			if (!isInside) {
				setIsExpanded(false);
			}
		};

		if (isExpanded) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isExpanded]);

	const handleCategoryChange = (categoryId: string) => {
		onCategoryChange(categoryId);
		setIsExpanded(true);
	};

	const handleItemClick = (item: ClothItem) => {
		onItemClick(item);
		setIsExpanded(false);
	};

	return (
		<div
			ref={containerRef}
			className='absolute bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50'
		>
			<div className='flex items-center justify-between border-b border-gray-200'>
				<CodiCategoryTabs
					categories={categories}
					activeCategory={activeCategory}
					onCategoryChange={handleCategoryChange}
				/>
				<button onClick={() => setIsExpanded(!isExpanded)}>
					{isExpanded ? '접기' : '더보기'}
				</button>
			</div>
			{/* 아코디언 영역 */}
			<div
				className={`overflow-hidden transition-all duration-300 ${
					isExpanded ? 'max-h-[300px]' : 'max-h-0'
				}`}
			>
				<div className='p-4 overflow-y-auto max-h-[400px] min-h-[400px]'>
					{filteredProducts.length > 0 ? (
						<ClothListContainer
							items={filteredProducts}
							onItemClick={handleItemClick}
							type='cloth'
						/>
					) : (
						<div className='flex justify-center items-center text-descriptionColor h-full'>
							옷이 없습니다!
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CodiEditBottomAccordion;
