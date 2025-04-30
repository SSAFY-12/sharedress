export interface UserMiniAvatarProps {
	src: string; // 아바타 이미지 URL
	size: 'sm' | 'md' | 'lg'; // 크기
	withBadge?: boolean; // 상태 뱃지 표시 여부
	editable?: boolean; // 수정 가능 표시 여부
	onClick?: () => void; // 클릭 이벤트
	className?: string; // 추가 스타일링
}
