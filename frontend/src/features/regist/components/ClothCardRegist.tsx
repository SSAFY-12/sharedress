import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { RegisteredBedge } from './RegisteredBedge';

interface ClothCardRegistProps {
	item: ClothItem;
	className?: string;
}

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCardRegist = ({
	item,
	className = '',
}: ClothCardRegistProps) => (
	<div className={className}>
		<div
			className={`w-full aspect-[10/11] border border-light overflow-hidden rounded-md relative`}
		>
			<img
				src={item.imageUrl || '/placeholder.svg?height=200&width=200'}
				alt={item.name}
				className='object-cover w-full'
			/>
			<RegisteredBedge libraryId={item.id} />
		</div>

		<div className='flex flex-col items-start gap-0.5 px-1'>
			<span className='w-full text-left text-smallDescription text-low'>
				{item.brand}
			</span>
			<span className='w-full text-left text-categoryButton text-regular'>
				{item.name}
			</span>
		</div>
	</div>
);
