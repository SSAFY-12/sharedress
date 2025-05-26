import { ItemCategoryBtnProps } from '@/components/etc/item-category-btn/ItemCategoryBtn.types';

export const ItemCategoryBtn = ({
	text,
	isActive,
	onClick,
	color = 'primary',
	className = '',
}: ItemCategoryBtnProps) => {
	const activeClass =
		color === 'primary'
			? isActive
				? 'border border-regular text-regular'
				: 'border border-light text-low'
			: isActive
			? 'bg-regular text-white'
			: 'bg-background text-regular';

	return (
		<button
			onClick={onClick}
			className={`px-3 py-1.5 rounded-full text-categoryButton transition-colors ${activeClass} ${className}`}
		>
			{text}
		</button>
	);
};
