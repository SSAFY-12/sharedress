interface ClothMainDisplayProps {
	item: {
		id: string;
		image: string;
		name: string;
		brand: string;
		description?: string;
	};
}

// 메인 옷 이미지, 수정 모드 시 오버레이 표시
export const ClothMainDisplay = ({ item }: ClothMainDisplayProps) => (
	<div className='flex flex-col items-center space-y-4'>
		<div className='relative w-full max-w-md aspect-square overflow-hidden rounded-lg'>
			<img
				src={item.image}
				alt={item.name}
				className='w-full h-full object-cover'
			/>
		</div>
		<div className='w-full max-w-md space-y-2'>
			<h2 className='text-xl font-semibold'>{item.name}</h2>
			<p className='text-gray-600'>{item.brand}</p>
			{item.description && (
				<p className='text-gray-500 text-sm'>{item.description}</p>
			)}
		</div>
	</div>
);
