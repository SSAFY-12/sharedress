import { FC } from 'react';
import NotificationItem from './NotificationItem';
import {
	UserPlus, // 친구 요청
	UserCheck, // 친구 수락
	Send, // 코디 요청
	ThumbsUp, // 코디 추천
	Shuffle, // 코디 복사
	MessageCircle, // 코디 댓글
	FileText, // (기본값)
	Bot, // AI 관련
} from 'lucide-react';
import useNotification from '@/features/alert/hooks/useNotification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

/**
 * NotificationList 컴포넌트
 * - 여러 개의 NotificationItem을 리스트 형태로 보여줍니다.
 * - 알림 센터, 알림 드로어, 모달 등에서 활용할 수 있습니다.
 * - 클릭 시 읽음 처리(파란 점 사라짐) 기능을 포함합니다.
 * - 부모 컨테이너에 맞춰 100% width/height로 확장됩니다.
 */

// 알림 타입별 아이콘 매핑
const typeIconMap: Record<number, any> = {
	1: UserPlus, // 친구 요청
	2: UserCheck, // 친구 수락
	3: Send, // 코디 요청
	4: ThumbsUp, // 코디 추천
	5: Shuffle, // 코디 복사
	6: MessageCircle, // 코디 댓글
	7: Bot, // AI 관련
};

const NotificationList: FC = () => {
	const { data, isLoading, error, readNotification } = useNotification();
	const navigate = useNavigate();

	const handleNotificationClick = (notification: any) => {
		readNotification({ notificationId: notification.id });
		switch (notification.notificationType) {
			case 1: // 친구 요청
			case 2: // 친구 수락
				navigate('/social/request');
				break;
			case 5: // 코디 복사
			case 6: // 코디 댓글
				navigate('/codi');
				break;
			case 3: // 코디 요청
				navigate('/social/codi-request');
				break;
			case 4: // 코디 추천
				navigate('/social');
				break;
			case 7: // AI 관련
				navigate('/cloth');
				break;
			default:
				break;
		}
	};

	if (error) {
		return (
			<div className='w-full h-full flex items-center justify-center bg-white'>
				<p className='text-red-500'>
					알림을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
				</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='w-full h-full flex items-center justify-center bg-white'>
				<p>알림을 불러오는 중...</p>
			</div>
		);
	}

	return (
		<div className='w-full h-full flex flex-col bg-white overflow-hidden'>
			{/* 알림 리스트 (스크롤 가능) */}
			<div className='flex-1 overflow-y-auto flex flex-col divide-y divide-gray-100 p-0 sm:p-4'>
				{data?.content.map((notification) => (
					<NotificationItem
						key={notification.id}
						icon={typeIconMap[notification.notificationType] || FileText}
						title={notification.title}
						message={notification.body}
						time={formatDistanceToNow(new Date(notification.createdAt), {
							addSuffix: true,
							locale: ko,
						})}
						read={notification.isRead}
						onClick={() => handleNotificationClick(notification)}
						requester={notification.requester}
					/>
				))}
			</div>
		</div>
	);
};

export default NotificationList;
