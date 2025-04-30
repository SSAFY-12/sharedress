import React from 'react';

export interface InputFieldProps {
	type: 'text' | 'select'; // 입력 타입
	placeholder: string; // placeholder 텍스트
	value: string; // 현재 값
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => void; // 값 변경 핸들러
	disabled?: boolean; // 비활성화 여부
	name?: string; // input/select의 name 속성
	optionList?: string[]; // select 옵션 리스트
	className?: string; // 추가 스타일링
}
