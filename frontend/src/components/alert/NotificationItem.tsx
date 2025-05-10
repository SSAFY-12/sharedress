import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * NotificationItem 컴포넌트
 * - 알림 리스트에서 개별 알림(아이템)을 표현합니다.
 * - lucide-react 아이콘을 props로 받아 사용합니다.
 * - 클릭, 읽음/안읽음 등 확장성을 고려한 구조입니다.
 * - 부모 컨테이너에 맞춰 100% width로 확장됩니다.
 */
export interface NotificationItemProps {
	icon: LucideIcon; // lucide-react 아이콘 타입
	title: string;
	message: string;
	time: string;
	read?: boolean; // 읽음/안읽음 상태
	onClick?: () => void; // 클릭 핸들러
	requester: {
		id: number;
		email: string;
		nickname: string;
		code: string;
		profileImage: string;
		oneLiner: string;
		isGuest: boolean;
	};
}

const NotificationItem: FC<NotificationItemProps> = ({
	icon: IconComponent, // 아이콘 컴포넌트
	title, // 알림 제목
	message, // 알림 메시지
	time, // 알림 시간
	read = false, // 읽음/안읽음 상태
	onClick, // 클릭 핸들러
	requester, // 요청자 정보
}) => (
	<div
		className={`w-full flex items-start gap-3 px-4 py-4 transition-colors cursor-pointer relative ${
			read ? 'bg-white' : '' // 읽음/안읽음 상태에 따른 배경색 변경
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
		<div className='flex-1 min-w-0 flex flex-col items-start text-left'>
			<div className='flex justify-between items-center w-full'>
				<span className='font-semibold text-gray-800 truncate'>{title}</span>
				<span className='text-xs text-gray-400 flex-shrink-0'>{time}</span>
			</div>
			<div className='mt-1 text-sm text-gray-500 break-all'>
				<span className='font-medium'>{requester.nickname}</span>님이 {message}
			</div>
		</div>
	</div>
);

export default NotificationItem;
