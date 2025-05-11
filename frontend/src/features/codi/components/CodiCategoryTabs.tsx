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
					className={`px-4 py-3.5 text-topHeader whitespace-nowrap relative rounded-none ${
						activeCategory === category.id
							? 'text-regular border-b-2 border-b-regular'
							: 'text-descriptionColor hover:text-low'
					}`}
				>
					{category.label}
				</button>
			))}
		</div>
	);
}
