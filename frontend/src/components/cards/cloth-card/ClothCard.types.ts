export interface ClothItem {
	id: number;
	name: string;
	brand?: string;
	category: string;
	imageUrl: string;
}

export interface ClothCardProps {
	item: ClothItem; // 옷 아이템 정보
	size: 'sm' | 'md' | 'lg'; // 카드 크기
	selected?: boolean; // 선택 상태
	onClick?: () => void; // 클릭 이벤트
	className?: string; // 추가 스타일링
}
