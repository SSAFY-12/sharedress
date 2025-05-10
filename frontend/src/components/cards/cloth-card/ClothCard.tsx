import { ClothCardProps } from './ClothCard.types';

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCard = ({
	item,
	size,
	selected = false,
	onClick,
	className = '',
	type,
}: ClothCardProps) => {
	const sizeClass = size
		? {
				sm: 'w-20 h-20',
				md: 'w-32 h-32',
				lg: 'w-48 h-48',
		  }[size]
		: '';

	return (
		<div
			onClick={onClick}
			className={`flex flex-col items-start ${sizeClass} ${className} cursor-pointer`}
		>
			<div
				className={`relative border ${
					selected ? 'border-rose-500 border-2' : 'border-gray-200'
				} rounded-md overflow-hidden w-full aspect-[10/11] cursor-pointer transition-all hover:shadow-md`}
			>
				<img
					src={item.imageUrl || '/placeholder.svg?height=200&width=200'}
					alt={item.name}
					className='object-cover w-full h-full'
				/>
				{selected && (
					<div className='absolute top-1 right-1 bg-rose-500 rounded-full w-4 h-4 flex items-center justify-center'>
						<span className='text-white text-xs'>✓</span>
					</div>
				)}
			</div>
			{type === 'cloth' ? (
				<p className='mt-2.5 text-categoryButton text-description'>
					{item.brand}
				</p>
			) : (
				<p className='mt-2.5 text-categoryButton text-description'>
					{item.name}
				</p>
			)}
		</div>
	);
};
