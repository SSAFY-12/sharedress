import { PrimaryBtn } from '@/components/buttons/primary-button/PrimaryBtn';
import { ClothCard } from '@/components/cards/cloth-card/ClothCard';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ExternalLink } from 'lucide-react';

interface ShoppingItemRowProps {
	item: ClothItem;
	shopName: string;
	shopUrl: string;
	onSelect?: () => void;
	selected?: boolean;
	className?: string;
}

export const ShoppingItemRow = ({
	item,
	shopName,
	shopUrl,
	onSelect,
	selected = false,
	className = '',
}: ShoppingItemRowProps) => (
	<div
		className={`flex items-center p-3 border rounded-md ${
			selected ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
		} ${className}`}
	>
		<ClothCard item={item} size='sm' selected={selected} onClick={onSelect} />
		<div className='ml-4 flex-1'>
			<h3 className='font-medium text-sm'>{item.name}</h3>
			<p className='text-xs text-gray-500'>{shopName}</p>
		</div>
		<a
			href={shopUrl}
			target='_blank'
			rel='noopener noreferrer'
			className='ml-2'
		>
			<PrimaryBtn
				size='compact'
				name='링크'
				color='primary'
				onClick={(e) => {
					e.preventDefault();
				}}
				className='flex items-center justify-center'
			>
				<ExternalLink className='h-4 w-4 mr-1' />
			</PrimaryBtn>
		</a>
	</div>
);
