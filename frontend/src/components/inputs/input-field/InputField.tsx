import { useEffect, useRef } from 'react';
import { InputFieldProps } from './InputField.types';

export const InputField = ({
	type,
	placeholder,
	value,
	onChange,
	onClick,
	onFocus,
	onBlur,
	disabled = false,
	className = '',
	hexCode,
}: InputFieldProps) => {
	const baseClass =
		'flex justify-between items-center px-4 py-2.5 bg-background h-12 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-light disabled:bg-background';
	const textClass =
		'text-default text-regular placeholder:text-descriptionColor text-left';

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (type === 'text' && textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [value, type]);

	if (type === 'text') {
		return (
			<textarea
				ref={textareaRef}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				disabled={disabled}
				className={`${baseClass} ${textClass} ${className} resize-none overflow-hidden h-auto min-h-[48px]`}
				onFocus={onFocus}
				onBlur={onBlur}
				rows={1}
			/>
		);
	}

	if (type === 'color') {
		return (
			<button
				type='button'
				className={`${baseClass} flex items-center gap-2 ${className}`}
				onClick={onClick}
				disabled={disabled}
			>
				<div className='flex items-center gap-2.5'>
					{hexCode && (
						<div
							className='w-4 h-4 rounded-full'
							style={{ backgroundColor: hexCode }}
						/>
					)}
					<span className={`${textClass}`}>{value}</span>
				</div>
				<img src='/icons/arrow_down.svg' alt='arrow-down' />
			</button>
		);
	}

	return (
		<button
			type='button'
			className={`${baseClass} ${className} text-left`}
			onClick={onClick}
			disabled={disabled}
		>
			<span
				className={`text-default text-left ${
					!value ? 'text-descriptionColor' : 'text-regular'
				}`}
			>
				{value || placeholder}
			</span>
			<img src='/icons/arrow_down.svg' alt='arrow-down' />
		</button>
	);
};
