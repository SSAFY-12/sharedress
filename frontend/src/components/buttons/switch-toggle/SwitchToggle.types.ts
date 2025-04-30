export interface SwitchToggleProps {
	checked: boolean; // 스위치 상태
	onToggle: () => void; // 토글 이벤트
	variant?: 'primary' | 'secondary'; // 색상 테마
	className?: string; // 추가 스타일링
}
