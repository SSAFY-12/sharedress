export interface ClothItem {
	id: string;
	name: string;
	imageUrl: string;
}

export interface ClothMainDisplayProps {
	item: ClothItem;
	editable?: boolean;
	onClick?: () => void;
}
