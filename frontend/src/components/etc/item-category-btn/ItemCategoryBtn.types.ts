export interface ItemCategoryBtnProps {
	text: string; // 버튼 텍스트
	isActive: boolean; // 활성화 상태
	onClick: () => void; // 클릭 이벤트
	color?: 'primary' | 'gray'; // 색상 테마
	className?: string; // 추가 스타일링
}
