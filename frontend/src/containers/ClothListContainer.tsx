import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothCard } from '@/components/cards/cloth-card/ClothCard';
import { ItemCategoryBtn } from '@/components/etc/item-category-btn/ItemCategoryBtn';

interface ClothListContainerProps {
	items: ClothItem[];
	categories?: string[];
	onItemClick?: (item: ClothItem) => void;
	onCategoryChange?: (category: string) => void;
	selectedCategory?: string;
	columns?: 2 | 3;
	className?: string;
}

export const ClothListContainer = ({
	items,
	categories = [],
	onItemClick,
	onCategoryChange,
	selectedCategory = '',
	columns = 3,
	className = '',
}: ClothListContainerProps) => (
	<div className={className}>
		{categories.length > 0 && (
			<div className='flex overflow-x-auto pb-2 mb-4 -mx-1 px-1'>
				{categories.map((category) => (
					<ItemCategoryBtn
						key={category}
						text={category}
						isActive={selectedCategory === category}
						onClick={() => onCategoryChange?.(category)}
						className='mr-1 whitespace-nowrap'
					/>
				))}
			</div>
		)}

		<div
			className={`grid gap-4 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
		>
			{items.map((item) => (
				<ClothCard
					key={item.id}
					item={item}
					size='md'
					onClick={() => onItemClick?.(item)}
				/>
			))}
		</div>
	</div>
);
