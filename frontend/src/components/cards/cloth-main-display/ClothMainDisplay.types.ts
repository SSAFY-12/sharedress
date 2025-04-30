export interface ClothItem {
	id: string;
	name: string;
	imageUrl: string;
}

export interface ClothMainDisplayProps {
	item: ClothItem; // 메인에 보여줄 옷 정보
	editable?: boolean; // 수정 가능 여부
	onClick?: () => void; // 수정 클릭 이벤트
	className?: string; // 추가 스타일링
}
