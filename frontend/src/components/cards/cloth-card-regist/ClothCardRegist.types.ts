export interface ClothItem {
	id: string;
	name: string;
	imageUrl: string;
	category: string;
	brand: string;
	price: number;
	purchaseDate: string;
}

export interface ClothCardProps {
	item: ClothItem; // 옷 아이템 정보
	size: 'sm' | 'md' | 'lg'; // 카드 크기
	selected?: boolean; // 선택 상태
	onClick?: () => void; // 클릭 이벤트
	className?: string; // 추가 스타일링
	isForRegist?: boolean; // 옷 등록시 사용되는 여부
}
