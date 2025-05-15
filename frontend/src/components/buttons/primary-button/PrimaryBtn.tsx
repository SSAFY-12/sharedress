import { PrimaryBtnProps } from './PrimaryBtn.types';

export const PrimaryBtn = ({
	size,
	name,
	color = 'primary',
	activate = true,
	onClick,
	className = '',
}: PrimaryBtnProps) => {
	const sizeClass = {
		full: 'w-full px-4 py-4 text-button',
		medium: 'w-full px-4 py-3.5 text-smallButton',
		compact: 'py-2 px-3.5 rounded-xl transition text-description',
		tiny: 'py-2 px-3 rounded-xl transition text-description',
	}[size];

	const colorClass = {
		primary: 'bg-regular hover:bg-regular/80 text-white',
		gray: 'bg-gray-400 hover:bg-gray-500 text-white',
		black: 'bg-regular hover:bg-regular/80 text-white',
		white: 'bg-white hover:bg-gray-100 text-regular',
		brown: 'bg-brownButton hover:bg-brownButton/80 text-white',
		background: 'bg-background hover:bg-light text-regular',
	}[color];

	return (
		<button
			onClick={onClick}
			disabled={!activate}
			className={`${sizeClass} ${colorClass} rounded-md transition-colors ${
				!activate ? 'opacity-50 cursor-not-allowed' : ''
			} ${className}`}
		>
			{name}
		</button>
	);
};
