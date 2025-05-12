import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';
import { Friend } from '@/features/social/pages/FriendCodiRequestPage';

interface UserRowItemProps {
	userId?: number;
	userName: string;
	userAvatar: string;
	userStatus?: string;
	actionButtonText?: string;
	onActionClick?: () => void;
	codiRequestClick?: (friend: Friend) => void;
	onClick?: () => void;
	className?: string;
	actionType?: 'arrow' | 'button';
}

// rowItem 컴포넌트 -> 상태메세지 데이터가 없음

export const UserRowItem = ({
	userId,
	userName,
	userAvatar,
	userStatus,
	actionButtonText,
	codiRequestClick,
	onClick,
	className = '',
	actionType = 'arrow',
}: UserRowItemProps) => (
	<div
		className={`flex items-center justify-between py-2.5 last:border-b-0 ${
			onClick ? 'cursor-pointer' : ''
		} ${className}`}
		onClick={onClick}
	>
		<div className='flex items-center'>
			<UserMiniAvatar src={userAvatar} size='md' />
			<div className='flex flex-col text-left'>
				<span className='ml-3 flex-1 text-smallButton text-regular'>
					{userName}
				</span>
				{userStatus && (
					<span className='ml-3 flex-1 text-description'>{userStatus}</span>
				)}
			</div>
		</div>
		{actionType === 'button' && actionButtonText && (
			<button
				type='button'
				className='py-2 px-3.5 rounded-xl hover:bg-low transition bg-brownButton text-white text-description'
				onClick={(e) => {
					e.stopPropagation();
					if (codiRequestClick && userId)
						codiRequestClick({
							receiverId: userId,
							nickname: userName,
							profileImage: userAvatar,
						});
				}}
			>
				{actionButtonText}
			</button>
		)}
		{actionType === 'arrow' && (
			<button
				type='button'
				className='p-1 rounded-full hover:bg-gray-100 transition'
				onClick={(e) => {
					e.stopPropagation();
					if (onClick) onClick();
				}}
			>
				<img src='/icons/arrow_right_black.svg' alt='arrow' />
			</button>
		)}
	</div>
);
