import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';
import { CodiPreviewCardProps } from '@/components/cards/codi-preview-card/CodiPreviewCard.types';

// 여러 옷 아이템을 작은 카드로 보여줌
export const CodiPreviewCard = ({
	items,
	userName,
	userAvatar,
	onClick,
	className = '',
}: CodiPreviewCardProps) => (
	<div
		className={`border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}
		onClick={onClick}
	>
		<div className='grid grid-cols-2 gap-2 mb-3'>
			{items.slice(0, 4).map((item) => (
				<div
					key={item.id}
					className='aspect-square rounded-md overflow-hidden border border-gray-200'
				>
					<img
						src={item.imageUrl || '/placeholder.svg'}
						alt={item.name}
						className='w-full h-full object-cover'
					/>
				</div>
			))}
		</div>

		{(userName || userAvatar) && (
			<div className='flex items-center mt-2'>
				{userAvatar && <UserMiniAvatar src={userAvatar} size='sm' />}
				{userName && <span className='text-sm font-medium'>{userName}</span>}
			</div>
		)}
	</div>
);
