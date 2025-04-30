interface CodiPreviewCardProps {
	items: Array<{
		id: string;
		image: string;
		name: string;
		brand: string;
	}>;
	description?: string;
}

// 여러 옷 아이템을 작은 카드로 보여줌
export const CodiPreviewCard = ({
	items,
	description,
}: CodiPreviewCardProps) => (
	<div className='flex flex-col space-y-4'>
		<div className='grid grid-cols-2 gap-4'>
			{items.map((item) => (
				<div
					key={item.id}
					className='relative aspect-square overflow-hidden rounded-lg'
				>
					<img
						src={item.image}
						alt={item.name}
						className='w-full h-full object-cover'
					/>
				</div>
			))}
		</div>
		{description && <p className='text-gray-600 text-sm'>{description}</p>}
	</div>
);
