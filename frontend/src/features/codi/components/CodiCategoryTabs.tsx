interface CodiCategoryTabsProps {
	categories: Array<{
		id: string;
		label: string;
	}>;
	activeCategory: string;
	onCategoryChange: (categoryId: string) => void;
}

export default function CodiCategoryTabs({
	categories,
	activeCategory,
	onCategoryChange,
}: CodiCategoryTabsProps) {
	return (
		<div className='flex overflow-x-auto scrollbar-hide border-b border-gray-200'>
			{categories.map((category) => (
				<button
					key={category.id}
					onClick={() => onCategoryChange(category.id)}
					className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative ${
						activeCategory === category.id
							? 'text-black border-b-2 border-black'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					{category.label}
				</button>
			))}
		</div>
	);
}
