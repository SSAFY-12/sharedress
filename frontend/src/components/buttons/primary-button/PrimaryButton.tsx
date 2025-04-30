import { PrimaryButtonProps } from './PrimaryButton.types';

export const PrimaryButton = ({
	size,
	name,
	color = 'primary',
	activate = true,
	onClick,
	className = '',
}: PrimaryButtonProps) => {
	const sizeClass = {
		full: 'w-full',
		medium: 'w-2/3',
		compact: 'w-1/3',
	}[size];

	const colorClass = {
		primary: 'bg-rose-500 hover:bg-rose-600',
		gray: 'bg-gray-400 hover:bg-gray-500',
		black: 'bg-black hover:bg-gray-800',
	}[color];

	return (
		<button
			onClick={onClick}
			disabled={!activate}
			className={`${sizeClass} ${colorClass} text-white py-2 rounded-md text-sm font-semibold transition-colors ${
				!activate ? 'opacity-50 cursor-not-allowed' : ''
			} ${className}`}
		>
			{name}
		</button>
	);
};
