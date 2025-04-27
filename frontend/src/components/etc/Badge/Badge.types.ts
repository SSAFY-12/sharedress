export interface BadgeProps {
	iconType: 'bell' | 'setting' | 'back' | 'next' | 'done';
	onClick?: () => void;
	text?: string;
	useIcon?: boolean;
}
