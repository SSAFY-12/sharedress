import React from 'react';

export interface SearchBarProps {
	placeholder: string; // 입력창 placeholder
	value: string; // 현재 값
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 값 변경 핸들러
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void; // 폼 제출 핸들러
	className?: string; // 추가 스타일링
}
