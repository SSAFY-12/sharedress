import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * NotificationItem 컴포넌트
 * - 알림 리스트에서 개별 알림(아이템)을 표현합니다.
 * - lucide-react 아이콘을 props로 받아 사용합니다.
 * - 클릭, 읽음/안읽음 등 확장성을 고려한 구조입니다.
 */
export interface NotificationItemProps {
	icon: LucideIcon; // lucide-react 아이콘 타입
	title: string;
	message: string;
	time: string;
	read?: boolean; // 읽음/안읽음 상태
	onClick?: () => void; // 클릭 핸들러
}

const NotificationItem: FC<NotificationItemProps> = ({
	icon: IconComponent,
	title,
	message,
	time,
	read = false,
	onClick,
}) => (
	<div
		className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 transition-colors cursor-pointer relative ${
			read ? 'bg-white' : 'bg-gray-100'
		}`}
		onClick={onClick}
		tabIndex={0}
		role='button'
		aria-pressed={read}
	>
		{/* 읽지 않은 알림 표시 (파란 점) */}
		{!read && (
			<span
				className='absolute left-2 top-2 w-2 h-2 bg-blue-500 rounded-full'
				aria-label='unread'
			/>
		)}
		{/* 알림 아이콘 */}
		<div className='flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200'>
			<IconComponent className='w-6 h-6 text-gray-600' />
		</div>
		{/* 알림 내용 */}
		<div className='flex-1'>
			<div className='flex justify-between items-center'>
				<span className='font-semibold text-gray-800'>{title}</span>
				<span className='text-xs text-gray-400'>{time}</span>
			</div>
			<div className='text-sm text-gray-500'>{message}</div>
		</div>
	</div>
);

export default NotificationItem;
