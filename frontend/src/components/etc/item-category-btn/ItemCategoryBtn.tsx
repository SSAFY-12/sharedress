interface ItemCategoryBtnProps {
	category: string;
	isActive: boolean;
	onClick: () => void;
}

export const ItemCategoryBtn = ({
	category,
	isActive,
	onClick,
}: ItemCategoryBtnProps) => (
	<button
		onClick={onClick}
		className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
			isActive
				? 'bg-indigo-600 text-white'
				: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
		}`}
	>
		{category}
	</button>
);
