import { Badge } from '@/components/etc/badge/Badge';
import { Icon } from '@/components/etc/badge/Badge.types';

export interface HeaderProps {
	closet?: boolean;
	showBack?: boolean;
	subtitle?: string;
	logo?: string;
	badgeIcon?: Icon;
	badgeText?: string;
	onBackClick?: () => void;
	onBadgeClick?: () => void;
	signUp?: boolean;
	onSignUpClick?: () => void;
}

const Header = ({
	closet = false,
	showBack = false,
	subtitle,
	logo,
	badgeIcon,
	badgeText,
	onBackClick,
	onBadgeClick,
	signUp,
	onSignUpClick,
}: HeaderProps) => {
	const backIcon = closet
		? '/icons/arrow_left_white.svg'
		: '/icons/arrow_left_black.svg';
	return (
		<header className='flex items-center justify-between h-16 px-4 bg-transparent'>
			<div className='flex items-center min-w-0'>
				{showBack && (
					<div className='flex items-center gap-1 min-w-0'>
						<button
							className='text-gray-600 flex items-center m-0 bg-transparent rounded-full p-1 transition-colors'
							onClick={onBackClick}
							aria-label='뒤로가기'
						>
							<img src={backIcon} alt='뒤로가기' />
						</button>
						{subtitle && (
							<h1 className='text-[15px] text-gray-900 font-medium truncate'>
								{subtitle}
							</h1>
						)}
					</div>
				)}
				{!showBack && logo && <img src='/icons/logo_white.svg' alt='로고' />}
			</div>

			{signUp && (
				<button
					className='px-3.5 py-1.5 bg-regular/60 rounded-xl'
					onClick={onSignUpClick}
				>
					<span className='text-white text-categoryButton'>회원가입</span>
				</button>
			)}

			{badgeIcon === 'bell' ? (
				<button onClick={onBadgeClick} aria-label='알림' className='p-0'>
					<img src='/icons/notification_white.svg' alt='알림 아이콘' />
				</button>
			) : badgeIcon === 'more' ? (
				<button onClick={onBadgeClick} aria-label='더보기' className='p-0'>
					<img src='/icons/more.svg' alt='더보기 아이콘' />
				</button>
			) : badgeIcon || badgeText ? (
				<Badge icon={badgeIcon} text={badgeText} onClick={onBadgeClick} />
			) : null}
		</header>
	);
};

export default Header;
