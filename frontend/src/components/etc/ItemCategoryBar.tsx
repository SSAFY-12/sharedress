import { ItemCategoryBtn } from './item-category-btn';

interface ItemCategoryBarProps {
	categories: string[];
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	className?: string;
}

const ItemCategoryBar = ({
	categories,
	selectedCategory,
	onCategoryChange,
	className = '',
}: ItemCategoryBarProps) => (
	<div className={`relative w-full ${className}`}>
		{/* Fade right */}
		<div className='pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10' />

		{/* 스크롤 가능한 영역 */}
		<div className='overflow-x-auto scrollbar-hide'>
			<div className='flex justify-start gap-1.5 min-w-max'>
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
);

export default ItemCategoryBar;
