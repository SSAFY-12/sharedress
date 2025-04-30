export interface ClothItem {
	id: string;
	name: string;
	imageUrl: string;
}

export interface CodiPreviewCardProps {
	items: ClothItem[]; // 코디에 포함된 옷 리스트
	userName?: string; // 코디 작성자 이름
	userAvatar?: string; // 코디 작성자 아바타
	onClick?: () => void; // 클릭 이벤트
	className?: string; // 추가 스타일링
}
