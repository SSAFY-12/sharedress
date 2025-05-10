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
		'border border-gray-300 bg-background h-12 rounded-md px-3 py-2 w-full text-default text-regular focus:outline-none focus:ring-2 focus:ring-light disabled:bg-gray-100';

	if (type === 'text') {
		return (
			<input
				type='text'
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				disabled={disabled}
				className={`${baseClass} ${className}`}
				onFocus={onFocus}
				onBlur={onBlur}
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
				{hexCode && (
					<div
						className='w-4 h-4 rounded-full'
						style={{ backgroundColor: hexCode }}
					/>
				)}
				<span className='text-left'>{value}</span>
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
			{value}
		</button>
	);
};
