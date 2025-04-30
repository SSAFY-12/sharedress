import { InputFieldProps } from './InputField.types';
import React from 'react';

export const InputField = ({
	type,
	placeholder,
	value,
	onChange,
	disabled = false,
	name,
	optionList = [],
	className = '',
}: InputFieldProps) => {
	const baseClass =
		'border rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100';

	return type === 'text' ? (
		<input
			type='text'
			placeholder={placeholder}
			value={value}
			onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
			disabled={disabled}
			name={name}
			className={`${baseClass} ${className}`}
		/>
	) : (
		<select
			value={value}
			onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
			disabled={disabled}
			name={name}
			className={`${baseClass} ${className}`}
		>
			{optionList.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	);
};
