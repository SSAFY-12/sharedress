// Tailwind CSS에서 여러 클래스를 조건부로 결합할 때 사용하는 유틸리티 함수
// 여러 인자를 배열로 받음
export const CN = (...classes: (string | undefined)[]) =>
	classes.filter(Boolean).join(' '); // 빈 문자열은 제외
// 이 Context는 모달의 상태(isOpen)와 닫기 함수(onClose)를 자식 컴포넌트들에게 전달
