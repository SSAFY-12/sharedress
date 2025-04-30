import { PrimaryButton } from '@/components/buttons/primary-button/PrimaryButton';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';

interface UserRowItemProps {
	userName: string;
	userAvatar: string;
	actionButtonText?: string;
	onActionClick?: () => void;
	onClick?: () => void;
	className?: string;
}

export const UserRowItem = ({
	userName,
	userAvatar,
	actionButtonText,
	onActionClick,
	onClick,
	className = '',
}: UserRowItemProps) => (
	<div
		className={`flex items-center p-3 border-b last:border-b-0 ${
			onClick ? 'cursor-pointer' : ''
		} ${className}`}
		onClick={onClick}
	>
		<UserMiniAvatar src={userAvatar} size='sm' />
		<span className='ml-3 flex-1 font-medium text-sm'>{userName}</span>
		{actionButtonText && (
			<PrimaryButton
				size='compact'
				name={actionButtonText}
				onClick={(e) => {
					e.stopPropagation();
					if (onActionClick) onActionClick();
				}}
			/>
		)}
	</div>
);
