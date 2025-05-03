export interface BadgeProps {
	icon?: //icon 타입
	| 'bell'
		| 'setting'
		| 'back'
		| 'next'
		| 'done'
		| 'info'
		| 'success'
		| 'warning'
		| 'error';
	text?: string; //text 타입
	onClick?: () => void; //onClick 타입
	className?: string; //className 타입
}
