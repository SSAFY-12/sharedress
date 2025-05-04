import { PrimaryBtn } from '@/components/buttons/primary-button/PrimaryBtn';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';

interface UserRowItemProps {
	userName: string;
	userAvatar: string;
	userStatus?: string;
	actionButtonText?: string;
	onActionClick?: () => void;
	onClick?: () => void;
	className?: string;
}

// rowItem 컴포넌트 -> 상태메세지 데이터가 없음

export const UserRowItem = ({
	userName,
	userAvatar,
	userStatus,
	actionButtonText,
	onActionClick,
	onClick,
	className = '',
}: UserRowItemProps) => (
	<div
		className={`flex items-center justify-between py-3 last:border-b-0 ${
			onClick ? 'cursor-pointer' : ''
		} ${className}`}
		onClick={onClick}
	>
		<div className='flex items-center'>
			<UserMiniAvatar src={userAvatar} size='md' />
			<div className='flex flex-col text-left'>
				<span className='ml-3 flex-1 font-extrabold text-smallButton'>
					{userName}
				</span>
				{userStatus && (
					<span className='ml-3 flex-1 font-medium text-description'>
						{userStatus}
					</span>
				)}
			</div>
		</div>
		{actionButtonText && (
			<PrimaryBtn
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
