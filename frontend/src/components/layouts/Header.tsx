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
	<div className='flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200'>
		<div className='flex items-center min-w-0'>
			{showBack && (
				<div className='flex items-center gap-1 min-w-0'>
					<button
						className='text-gray-600 flex items-center p-0 m-0 bg-white'
						onClick={onBackClick}
						aria-label='뒤로가기'
					>
						<ChevronLeft size={22} />
					</button>
					{subtitle && (
						<span className='text-[15px] text-gray-900 font-medium truncate'>
							{subtitle}
						</span>
					)}
				</div>
			)}
			{!showBack && logo && (
				<span className='font-bold text-lg text-gray-800'>{logo}</span>
			)}
		</div>
		<Badge type={badgeType} text={badgeText} />
	</div>
);

export default Header;
