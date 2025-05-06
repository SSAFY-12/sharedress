import { ClothCardProps } from './ClothCardRegist.types';

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCardRegist = ({
	item,
	selected = false,
	onClick,
	className = '',
}: ClothCardProps) => (
	// 사이즈가 아니라 10:11 비율이 유지되면서 container를 꽉채우도록 해야함.
	/*
	const sizeClass = {
		sm: 'w-20 h-20',
		md: 'w-32 h-32',
		lg: 'w-48 h-48',
	}[size];
*/

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
