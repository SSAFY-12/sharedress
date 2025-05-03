import { PrimaryBtn } from '@/components/buttons/primary-button/PrimaryBtn';

import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';

interface ProfileHeaderCardProps {
	userName: string;
	userAvatar: string;
	statusMessage?: string;
	actionButtonText?: string;
	onActionClick?: () => void;
	className?: string;
}

export const ProfileHeaderCard = ({
	userName,
	userAvatar,
	statusMessage,
	actionButtonText,
	onActionClick,
	className = '',
}: ProfileHeaderCardProps) => (
	<div className={`flex items-center p-4 border-b ${className}`}>
		<UserMiniAvatar src={userAvatar} size='lg' />
		<div className='ml-4 flex-1'>
			<h2 className='font-bold text-lg'>{userName}</h2>
			{statusMessage && (
				<p className='text-sm text-gray-500'>{statusMessage}</p>
			)}
		</div>
		{actionButtonText && (
			<PrimaryBtn
				size='compact'
				name={actionButtonText}
				onClick={() => onActionClick?.()}
			/>
		)}
	</div>
);
