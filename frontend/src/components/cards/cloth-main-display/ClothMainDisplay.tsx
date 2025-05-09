import { Camera } from 'lucide-react';
import { ClothMainDisplayProps } from './ClothMainDisplay.types';

// 메인 옷 이미지, 수정 모드 시 오버레이 표시
export const ClothMainDisplay = ({
	item,
	editable = false,
	onClick,
	className = '',
	showMoreButton = false,
	onMoreButtonClick,
	recommender = null,
}: ClothMainDisplayProps) => (
	<div
		className={`relative w-full aspect-[10/11] border rounded-md overflow-hidden ${className}`}
	>
		<img
			src={item.imageUrl || '/placeholder.svg?height=400&width=400'}
			alt={item.name}
			className='object-cover w-full h-full'
		/>

		{/* 더보기 버튼 */}
		{showMoreButton && (
			<button
				onClick={onMoreButtonClick}
				className='absolute top-5 right-5 p-0 z-10'
				aria-label='더보기'
			>
				<img src='/icons/more.svg' alt='more' />
			</button>
		)}

		{/* 추천인 정보 */}
		{recommender && (
			<div className='absolute bottom-2 right-2 flex items-center'>
				<img
					src={recommender.imageUrl || 'https://picsum.photos/200'}
					alt={recommender.name}
					className='w-7 h-7 rounded-full mr-2 object-cover'
				/>
				<span className='text-xs font-medium text-[#3a3636'>
					{recommender.name}님의 추천 코디
				</span>
			</div>
		)}

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
