import type React from 'react';

// 1. Context 타입 정의 === ModalContextType
// Context는 React에서 컴포넌트 간에 데이터를 전달하는 방법.
// 여기서는 모달의 상태와 닫기 함수를 전달하기 위해 사용.
export type ModalContextType = {
	isOpen: boolean; // 모달이 열려있는지 여부
	onClose: () => void; // 모달을 닫는 함수
};

// ----- 실제 모달 컴포넌트의 Props 타입 -----

// 2. 모달의 기본 Props 타입 === Modal(Header, Body, Footer의 최상위 컴포넌트)
export interface ModalProps {
	isOpen: boolean; // 모달이 열려있는지 여부
	onClose: () => void; // 모달을 닫는 함수
	children: React.ReactNode; // 하위 컴포넌트들 (Header, Body, Footer)
	className?: string; // 추가 스타일 클래스 (예: "w-96" - 모달 너비 조정)
	overlayClassName?: string; // 오버레이(배경) 추가 스타일
}

// 3. 닫기 버튼 Props 타입 === Modal.Close
export interface ModalCloseProps {
	className?: string; // 닫기 버튼의 추가 스타일 (예: "text-red-500" - 빨간색으로 변경)
}

// 4. 헤더 Props 타입 === Modal.Header
export interface ModalHeaderProps {
	children: React.ReactNode; // 헤더 내용 (예: 제목, 아이콘 등)
	className?: string; // 헤더의 추가 스타일 (예: "bg-gray-100" - 배경색 변경)
	showCloseButton?: boolean; // 닫기 버튼 표시 여부
}

// 5. 본문 Props 타입 === Modal.Body
export interface ModalBodyProps {
	children: React.ReactNode; // 본문 내용 (예: 텍스트, 폼, 이미지 등)
	className?: string; // 본문의 추가 스타일 (예: "p-6" - 패딩 조정)
}

// 6. 푸터 Props 타입 === Modal.Footer
export interface ModalFooterProps {
	children: React.ReactNode; // 푸터 내용 (예: 버튼, 링크 등)
	className?: string; // 푸터의 추가 스타일 (예: "bg-gray-50" - 배경색 변경)
}

// 서브컴포넌트들의 타입 정의
export interface ModalSubComponent {
	displayName: string;
}

export type ModalCloseComponent = React.FC<ModalCloseProps> & ModalSubComponent;
export type ModalHeaderComponent = React.FC<ModalHeaderProps> &
	ModalSubComponent;
export type ModalBodyComponent = React.FC<ModalBodyProps> & ModalSubComponent;
export type ModalFooterComponent = React.FC<ModalFooterProps> &
	ModalSubComponent;

// MainModal 타입에 서브컴포넌트들 추가
export interface MainModalComponent extends React.FC<ModalProps> {
	Close: ModalCloseComponent;
	Header: ModalHeaderComponent;
	Body: ModalBodyComponent;
	Footer: ModalFooterComponent;
}
