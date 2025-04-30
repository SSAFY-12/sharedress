export interface ClothItem {
	id: string;
	name: string;
	imageUrl: string;
}

export interface ClothCardProps {
	item: ClothItem;
	size: 'sm' | 'md' | 'lg';
	selected?: boolean;
	onClick?: () => void;
}
