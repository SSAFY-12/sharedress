import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/etc/badge/Badge';

export interface HeaderProps {
	showBack?: boolean;
	subtitle?: string;
	logo?: string;
	badgeIcon?:
		| 'bell'
		| 'setting'
		| 'back'
		| 'next'
		| 'done'
		| 'info'
		| 'success'
		| 'warning'
		| 'error'
		| 'profile'
		| 'add';
	badgeText?: string;
	onBackClick?: () => void;
	onBadgeClick?: () => void;
}

const Header = ({
	showBack = false,
	subtitle,
	logo,
	badgeIcon,
	badgeText,
	onBackClick,
	onBadgeClick,
}: HeaderProps) => (
	<header className='flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200'>
		<div className='flex items-center min-w-0'>
			{showBack && (
				<div className='flex items-center gap-1 min-w-0'>
					<button
						className='text-gray-600 flex items-center p-0 m-0 bg-white hover:bg-gray-50 rounded-full p-1 transition-colors'
						onClick={onBackClick}
						aria-label='뒤로가기'
					>
						<ChevronLeft size={22} />
					</button>
					{subtitle && (
						<h1 className='text-[15px] text-gray-900 font-medium truncate'>
							{subtitle}
						</h1>
					)}
				</div>
			)}
			{!showBack && logo && (
				<h1 className='font-bold text-lg text-gray-800'>{logo}</h1>
			)}
		</div>
		{(badgeIcon || badgeText) && (
			<Badge icon={badgeIcon} text={badgeText} onClick={onBadgeClick} />
		)}
	</header>
);

export default Header;
