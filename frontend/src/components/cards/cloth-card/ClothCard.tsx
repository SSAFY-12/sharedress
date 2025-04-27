interface ClothCardProps {
	item: {
		id: string;
		image: string;
		name: string;
		brand: string;
	};
	size?: 'small' | 'medium' | 'large';
}

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCard = ({ item, size = 'medium' }: ClothCardProps) => {
	const sizeClasses = {
		small: 'w-20 h-20',
		medium: 'w-32 h-32',
		large: 'w-48 h-48',
	};

	return (
		<div className='flex flex-col items-center'>
			<div
				className={`${sizeClasses[size]} relative overflow-hidden rounded-lg`}
			>
				<img
					src={item.image}
					alt={item.name}
					className='w-full h-full object-cover'
				/>
			</div>
			<div className='mt-2 text-center'>
				<p className='text-sm font-medium'>{item.name}</p>
				<p className='text-xs text-gray-500'>{item.brand}</p>
			</div>
		</div>
	);
};
