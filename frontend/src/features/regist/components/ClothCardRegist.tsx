import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { RegisteredBedge } from './RegisteredBedge';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ClothCardRegistProps {
	item: ClothItem;
	className?: string;
}

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCardRegist = ({
	item,
	className = '',
}: ClothCardRegistProps) => {
	const [imageError, setImageError] = useState(false);

	return (
		<div className={className}>
			<div
				className={`w-full aspect-[10/11] border border-light overflow-hidden rounded-md relative`}
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
				<RegisteredBedge libraryId={item.id} />
			</div>

			<div className='flex flex-col w-full items-start gap-0.5 px-1'>
				<span className='w-full text-left text-smallDescription text-low'>
					{item.brand}
				</span>
				<span className='w-full text-left text-categoryButton text-regular'>
					{item.name}
				</span>
			</div>
		</div>
	);
};
