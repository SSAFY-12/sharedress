import { ItemCategoryBtnProps } from './ItemCategoryBtn.types';

export const ItemCategoryBtn = ({
	text,
	isActive,
	onClick,
	color = 'primary',
	className = '',
}: ItemCategoryBtnProps) => {
	const activeClass = isActive
		? color === 'primary'
			? 'bg-rose-500 text-white'
			: 'bg-gray-600 text-white'
		: 'bg-gray-100 text-gray-700 hover:bg-gray-200';

	return (
		<button
			onClick={onClick}
			className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeClass} ${className}`}
		>
			{text}
		</button>
	);
};
