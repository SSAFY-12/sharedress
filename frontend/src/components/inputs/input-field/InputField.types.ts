import React from 'react';

export interface InputFieldProps {
	type: 'text' | 'select';
	placeholder: string;
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => void;
	disabled: boolean;
	name?: string;
	optionList?: string[];
}
