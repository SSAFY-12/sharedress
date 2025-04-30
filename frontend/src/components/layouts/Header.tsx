import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/etc/badge/Badge';

interface HeaderProps {
	showBack?: boolean;
	subtitle?: string;
	logo?: string;
	badge?: {
		iconType:
			| 'bell'
			| 'setting'
			| 'back'
			| 'next'
			| 'done'
			| 'info'
			| 'success'
			| 'warning'
			| 'error';
		text: string;
	};
	// 이전 방식과의 호환성을 위한 props
	badgeType?:
		| 'bell'
		| 'setting'
		| 'back'
		| 'next'
		| 'done'
		| 'info'
		| 'success'
		| 'warning'
		| 'error';
	badgeText?: string;
	onBackClick?: () => void;
}

const Header = ({
	showBack = false,
	subtitle,
	logo,
	badge,
	badgeType,
	badgeText,
	onBackClick,
}: HeaderProps) => {
	// 이전 방식과의 호환성을 위한 props
	const getBadgeProps = () => {
		if (badge) {
			return badge;
		}
		if (badgeType && badgeText) {
			//뱃지 타입과 텍스트가 모두 제공되는 경우
			return {
				iconType: badgeType,
				text: badgeText,
			};
		}
		return null;
	};

	const badgeProps = getBadgeProps();

	return (
		<header
			className='flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200'
			role='banner'
		>
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
			{badgeProps && (
				<Badge iconType={badgeProps.iconType} text={badgeProps.text} />
			)}
		</header>
	);
};

export default Header;
