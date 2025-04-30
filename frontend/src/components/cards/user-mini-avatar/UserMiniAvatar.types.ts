export interface UserMiniAvatarProps {
	src: string;
	size: 'sm' | 'md' | 'lg';
	withBadge?: boolean;
	editable?: boolean;
	onClick?: () => void;
}
