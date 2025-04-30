export interface PrimaryButtonProps {
	size: 'full' | 'medium' | 'compact';
	name: string;
	color: 'black' | 'gray';
	activate: boolean;
	onClick: () => void;
}
