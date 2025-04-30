import { Camera } from 'lucide-react';
import { ClothMainDisplayProps } from './ClothMainDisplay.types';

// 메인 옷 이미지, 수정 모드 시 오버레이 표시
export const ClothMainDisplay = ({
	item,
	editable = false,
	onClick,
	className = '',
}: ClothMainDisplayProps) => (
	<div
		className={`relative w-full h-96 border rounded-md overflow-hidden ${className}`}
	>
		<img
			src={item.imageUrl || '/placeholder.svg?height=400&width=400'}
			alt={item.name}
			className='object-cover w-full h-full'
		/>
		{editable && (
			<div
				onClick={onClick}
				className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-sm cursor-pointer opacity-0 hover:opacity-100 transition-opacity'
			>
				<Camera className='h-8 w-8 mb-2' />
				<span>수정하기</span>
			</div>
		)}
	</div>
);
