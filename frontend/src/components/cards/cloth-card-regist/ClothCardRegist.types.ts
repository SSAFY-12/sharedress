import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';

export interface ClothCardRegistProps {
	item: ClothItem;
	selected?: boolean;
	onClick?: () => void;
	className?: string;
}
