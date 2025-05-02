import React from 'react';

export interface PrimaryBtnProps {
	size: 'full' | 'medium' | 'compact'; // 버튼 크기
	name: string; // 버튼에 표시될 텍스트
	color?: 'primary' | 'black' | 'gray'; // 버튼 색상
	activate?: boolean; // 활성화 여부
	onClick: ((e: React.MouseEvent) => void) | (() => void); // 클릭 이벤트 핸들러
	className?: string; // 추가 스타일링
	children?: React.ReactNode; // 자식 요소
}
