import { Badge } from '@/components/etc/badge/Badge';
import { useNavigate } from 'react-router-dom';

interface SocialHeaderProps {
	onProfileClick?: () => void;
	onAddClick?: () => void;
}

const SocialHeader = ({ onProfileClick, onAddClick }: SocialHeaderProps) => {
	const navigate = useNavigate();

	const handleProfileClick = () => {
		if (onProfileClick) {
			onProfileClick();
		} else {
			navigate('/social/add');
		}
	};

	const handleAddClick = () => {
		if (onAddClick) {
			onAddClick();
		} else {
			navigate('/social/request');
		}
	};

	return (
		<header className='flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200'>
			<h1 className='font-bold text-lg text-gray-800 font-logo'>쉐어드레스</h1>
			<div className='flex gap-2'>
				<Badge icon='profile' onClick={handleProfileClick} />
				<Badge icon='add' onClick={handleAddClick} />
			</div>
		</header>
	);
};

export default SocialHeader;
