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

	if (type === 'text') {
		return (
			<input
				type='text'
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				disabled={disabled}
				className={`${baseClass} ${textClass} ${className} `}
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
			<span className={`${textClass}`}>{value}</span>
			<img src='/icons/arrow_down.svg' alt='arrow-down' />
		</button>
	);
};
