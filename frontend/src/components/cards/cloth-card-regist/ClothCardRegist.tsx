import { ClothCardRegistProps } from './ClothCardRegist.types';

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCardRegist = ({
	item,
	selected = false,
	onClick,
	className = '',
}: ClothCardRegistProps) => (
	<div onClick={onClick} className={className}>
		<div
			className={`w-full aspect-[10/11] border border-light overflow-hidden rounded-md relative`}
		>
			<img
				src={item.imageUrl || '/placeholder.svg?height=200&width=200'}
				alt={item.name}
				className='object-cover w-full'
			/>

			{selected ? (
				<div className='absolute top-1 right-1 bg-rose-500 rounded-full w-4 h-4 flex items-center justify-center'>
					<span className='text-white text-xs'>✓</span>
				</div>
			) : (
				<div className='absolute top-1 right-1 bg-black/50 rounded-full w-4 h-4 flex items-center justify-center'>
					<span className='text-white text-xs'>✓</span>
				</div>
			)}
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
