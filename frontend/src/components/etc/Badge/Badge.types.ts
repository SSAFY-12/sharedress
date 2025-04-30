export interface BadgeProps {
	iconType:
		| 'bell'
		| 'setting'
		| 'back'
		| 'next'
		| 'done'
		| 'info'
		| 'success'
		| 'warning'
		| 'error'; // 아이콘 종류
	onClick?: () => void; // 클릭 핸들러
	text?: string; // 텍스트 표시 (아이콘 대신)
	useIcon?: boolean; // 아이콘 사용 여부
	className?: string; // 추가 스타일링
}
