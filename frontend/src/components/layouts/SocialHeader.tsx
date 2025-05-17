import { useNavigate } from 'react-router-dom';
import { useSocialStore } from '@/store/useSocialStore';
interface SocialHeaderProps {
	onProfileClick?: () => void;
	onAddClick?: () => void;
}

const SocialHeader = ({ onProfileClick, onAddClick }: SocialHeaderProps) => {
	const navigate = useNavigate();
	const hasRequest = useSocialStore((state) => state.hasRequest);

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
		<header className='flex items-center justify-between h-16 px-4 bg-transparent'>
			<img src='/icons/logo_black.svg' alt='쉐어드레스' />
			<div className='flex gap-4'>
				<img
					src={
						hasRequest
							? '/icons/friend_request_unread.svg'
							: '/icons/friend_request.svg'
					}
					alt='친구요청'
					onClick={handleAddClick}
					className='cursor-pointer'
				/>
				<img
					src='/icons/frined_add.svg'
					alt='친구추가'
					onClick={handleProfileClick}
					className='cursor-pointer'
				/>
			</div>
		</header>
	);
};

export default SocialHeader;
