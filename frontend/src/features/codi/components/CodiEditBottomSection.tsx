import { ClothListContainer } from '@/containers/ClothListContainer';
import CodiCategoryTabs from './CodiCategoryTabs';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';

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
}

const CodiEditBottomSection = ({
	categories,
	activeCategory,
	filteredProducts,
	onCategoryChange,
	onItemClick,
}: CodiEditBottomSectionProps) => (
	<div className='flex-1 flex flex-col min-h-0 bg-white border-t border-gray-100'>
		<div className='flex-shrink-0'>
			<CodiCategoryTabs
				categories={categories}
				activeCategory={activeCategory}
				onCategoryChange={onCategoryChange}
			/>
		</div>
		<div className='flex-1 overflow-y-auto'>
			<div className='p-4'>
				<ClothListContainer
					items={filteredProducts}
					onItemClick={onItemClick}
					type='cloth'
				/>
			</div>
		</div>
	</div>
);

export default CodiEditBottomSection;
