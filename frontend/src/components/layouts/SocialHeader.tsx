import { Badge } from '@/components/etc/badge/Badge';

interface SocialHeaderProps {
	onProfileClick?: () => void;
	onAddClick?: () => void;
}

const SocialHeader = ({ onProfileClick, onAddClick }: SocialHeaderProps) => (
	<header className='flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200'>
		<h1 className='font-bold text-lg text-gray-800 font-logo'>쉐어드레스</h1>
		<div className='flex gap-2'>
			<Badge icon='profile' onClick={onProfileClick} />
			<Badge icon='add' onClick={onAddClick} />
		</div>
	</header>
);

export default SocialHeader;
