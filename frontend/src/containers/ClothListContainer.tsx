import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothCard } from '@/components/cards/cloth-card/ClothCard';
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
	type?: 'cloth' | 'codi'; // 코디용 옷 리스트인지 옷 리스트인지
}

export const ClothListContainer = ({
	items,
	onItemClick,
	columns = 3,
	className = '',
	isForRegist = false,
	type,
}: ClothListContainerProps) => (
	<div className={className}>
		<div
			className={`grid w-full gap-x-2.5 gap-y-3.5 ${
				columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
			}`}
		>
			{items.map((item) =>
				!isForRegist ? (
					<ClothCard
						key={item.id}
						item={item}
						onClick={() => onItemClick?.(item)}
						className='w-full aspect-[10/11]'
						type={type}
					/>
				) : (
					<ClothCardRegist
						key={item.id}
						item={item}
						onClick={() => onItemClick?.(item)}
						className='flex flex-col w-full gap-2.5 items-center'
					/>
				),
			)}
		</div>
	</div>
);
