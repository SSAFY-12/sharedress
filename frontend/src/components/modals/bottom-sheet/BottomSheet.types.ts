import type React from 'react';

// 바텀 시트의 메인 컴포넌트 props
export interface BottomSheetProps {
	isOpen: boolean; // 바텀 시트 열림/닫힘 상태
	onClose: () => void; // 바텀 시트를 닫는 함수
	children: React.ReactNode; // 바텀 시트 내부 컨텐츠 === 버튼 / 텍스트 / 이미지 등 모든 요소
	className?: string; // 추가 스타일링을 위한 클래스
	snapPoints?: number[]; // 바텀 시트가 멈출 수 있는 위치들 (0~1 사이 값)
	initialSnap?: number; // 초기 스냅 포인트 인덱스(어느 높이에서 시작할지)
	showDragIndicator?: boolean; // 드래그 핸들러 표시 여부(드래그 핸들러 막대 표시)
}
