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
		<div className='flex overflow-x-auto scrollbar-hide'>
			{categories.map((category) => (
				<button
					key={category.id}
					onClick={() => onCategoryChange(category.id)}
					className={`px-3.5 py-2.5 text-default whitespace-nowrap relative rounded-none ${
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
