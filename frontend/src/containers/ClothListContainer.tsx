import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothCard } from '@/components/cards/cloth-card/ClothCard';
import { ItemCategoryBtn } from '@/components/etc/item-category-btn/ItemCategoryBtn';
import { ClothCardRegist } from '@/components/cards/cloth-card-regist/ClothCardRegist';

interface ClothListContainerProps {
	items: ClothItem[];
	categories?: string[];
	onItemClick?: (item: ClothItem) => void;
	onCategoryChange?: (category: string) => void;
	selectedCategory?: string;
	columns?: 2 | 3;
	className?: string;
	isForRegist?: boolean; // 옷 등록시 사용되는것인지 여부
}

export const ClothListContainer = ({
	items,
	categories = [],
	onItemClick,
	onCategoryChange,
	selectedCategory = '',
	columns = 3,
	className = '',
	isForRegist = false,
}: ClothListContainerProps) => (
	<div className={className}>
		{/* ✅ 스크롤 + Fade 구조 */}
		<div className='relative w-full'>
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

		<div
			className={`grid w-full gap-x-2.5 gap-y-5 ${
				columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
			}`}
		>
			{items.map((item) =>
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
						onClick={() => onItemClick?.(item)}
					/>
				),
			)}
		</div>
	</div>
);
