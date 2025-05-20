import { Lock } from 'lucide-react';
import { ClothCardProps } from './ClothCard.types';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCard = ({
	item,
	size,
	selected = false,
	onClick,
	className = '',
	type,
}: ClothCardProps) => {
	const [imageError, setImageError] = useState(false);

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
				<LazyLoadImage
					src={
						imageError
							? '/placeholder.svg?height=200&width=200'
							: item.imageUrl || '/placeholder.svg?height=200&width=200'
					}
					alt={item.name}
					effect='blur'
					wrapperClassName='w-full h-full'
					className='object-cover w-full h-full'
					onError={() => setImageError(true)}
					placeholderSrc='/placeholder.svg?height=200&width=200'
				/>
				{!item.isPublic && (
					<div className='absolute top-1.5 right-1.5 bg-black/60 rounded-full p-2 flex items-center justify-center'>
						<Lock className='w-4 h-4 text-white' />
					</div>
				)}
				{selected && (
					<div className='absolute top-1 right-1 bg-rose-500 rounded-full w-4 h-4 flex items-center justify-center'>
						<span className='text-white text-xs'>✓</span>
					</div>
				)}
			</div>
			<div className='w-full'>
				{type === 'cloth' ? (
					<p className='mt-2.5 text-categoryButton text-description truncate text-left'>
						{item.brand}
					</p>
				) : (
					<p className='mt-2.5 text-categoryButton text-description truncate text-left'>
						{item.name}
					</p>
				)}
			</div>
		</div>
	);
};
