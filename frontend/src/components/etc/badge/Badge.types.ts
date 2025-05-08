export interface BadgeProps {
	icon?:
		| 'bell'
		| 'setting'
		| 'back'
		| 'next'
		| 'done'
		| 'info'
		| 'success'
		| 'warning'
		| 'error'
		| 'profile'
		| 'add'; // 아이콘 종류
	onClick?: () => void; // 클릭 핸들러
	text?: string; // 텍스트 표시 (아이콘 대신)
	className?: string; // 추가 스타일링
}
