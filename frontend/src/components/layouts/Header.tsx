import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/etc/badge/Badge';

interface HeaderProps {
	showBack?: boolean;
	subtitle?: string;
	logo?: string;
	badgeType: 'success' | 'error' | 'warning' | 'info';
	badgeText: string;
	onBackClick?: () => void;
}

const Header = ({
	showBack = false,
	subtitle,
	logo,
	badgeType,
	badgeText,
	onBackClick,
}: HeaderProps) => (
	<div className='flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200'>
		<div className='flex items-center gap-2 min-w-0'>
			{showBack && (
				<button
					className='text-xl text-gray-500 bg-white'
					onClick={onBackClick}
					aria-label='뒤로가기'
				>
					<ChevronLeft size={24} />
				</button>
			)}
			{showBack && subtitle && (
				<span className='text-base text-gray-700 truncate'>{subtitle}</span>
			)}
			{!showBack && logo && (
				<span className='font-bold text-lg text-gray-800'>{logo}</span>
			)}
		</div>
		<Badge type={badgeType} text={badgeText} />
	</div>
);

export default Header;
