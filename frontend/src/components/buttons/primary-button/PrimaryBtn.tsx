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
		full: 'w-full',
		medium: 'w-2/3',
		compact: 'w-1/3',
	}[size];

	const colorClass = {
		primary: 'bg-regular hover:bg-regular/80 text-white',
		gray: 'bg-gray-400 hover:bg-gray-500 text-white',
		black: 'bg-black hover:bg-gray-800 text-white',
		white: 'bg-white hover:bg-gray-100 text-regular',
	}[color];

	return (
		<button
			onClick={onClick}
			disabled={!activate}
			className={`${sizeClass} ${colorClass} py-3.5 rounded-md text-smallButton font-smallButton transition-colors ${
				!activate ? 'opacity-50 cursor-not-allowed' : ''
			} ${className}`}
		>
			{name}
		</button>
	);
};
