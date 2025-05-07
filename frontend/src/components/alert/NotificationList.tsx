import { FC, useState } from 'react';
import NotificationItem from './NotificationItem';
import {
	FileText,
	UserPlus,
	UserCheck,
	MessageCircle,
	CornerDownRight,
	ThumbsUp,
	Shuffle,
	Send,
} from 'lucide-react';

/**
 * NotificationList 컴포넌트
 * - 여러 개의 NotificationItem을 리스트 형태로 보여줍니다.
 * - 알림 센터, 알림 드로어, 모달 등에서 활용할 수 있습니다.
 * - 클릭 시 읽음 처리(파란 점 사라짐) 기능을 포함합니다.
 * - 부모 컨테이너에 맞춰 100% width/height로 확장됩니다.
 */

// 알림 타입별 아이콘 매핑
const typeIconMap: Record<string, any> = {
	friend_request: UserPlus, // 친구 추가 요청
	friend_accept: UserCheck, // 친구 수락 확정
	comment: MessageCircle, // 댓글 알림
	reply: CornerDownRight, // 답글 알림
	recommend: ThumbsUp, // 코디 추천
	adopt: Shuffle, // 코디 편입
	coordi_request: Send, // 코디 요청
};

// 샘플 알림 데이터
const sampleNotifications = [
	{
		type: 'friend_request',
		title: '친구 추가 요청',
		message: '홍길동님이 친구 요청을 보냈습니다.',
		time: '방금 전',
		read: false,
		link: '/friend-requests',
	},
	{
		type: 'friend_accept',
		title: '친구 수락 확정',
		message: '김철수님이 친구 요청을 수락했어요.',
		time: '1분 전',
		read: false,
		link: '/profile/123',
	},
	{
		type: 'comment',
		title: '댓글 알림',
		message: '친구가 내 코디에 댓글을 남겼어요.',
		time: '5분 전',
		read: false,
		link: '/coordi/456',
	},
	{
		type: 'reply',
		title: '답글 알림',
		message: '친구가 내 댓글에 답글을 남겼어요.',
		time: '10분 전',
		read: true,
		link: '/coordi/456#comment-789',
	},
	{
		type: 'recommend',
		title: '코디 추천',
		message: '친구가 코디를 추천했어요.',
		time: '30분 전',
		read: false,
		link: '/coordi/789',
	},
	{
		type: 'adopt',
		title: '코디 편입',
		message: '친구가 내가 추천한 코디를 내 코디로 편입했어요.',
		time: '1시간 전',
		read: false,
		link: '/coordi/789',
	},
	{
		type: 'coordi_request',
		title: '코디 요청',
		message: '친구가 나에게 코디를 요청했어요.',
		time: '2시간 전',
		read: false,
		link: '/coordi-requests',
	},
];

const NotificationList: FC = () => {
	// 추후 서버 측에서 로직이 내려오면 달라질 수 있음

	// 읽음/안읽음 상태 관리
	const [notifications, setNotifications] = useState(sampleNotifications);

	// 알림 클릭 시 읽음 처리
	const handleClick = (idx: number) => {
		setNotifications((prev) =>
			prev.map((n, i) => (i === idx ? { ...n, read: true } : n)),
		);
	};

	return (
		<div className='w-full h-full flex flex-col bg-white overflow-hidden'>
			{/* 알림 리스트 (스크롤 가능) */}
			<div className='flex-1 overflow-y-auto flex flex-col divide-y divide-gray-100 p-0 sm:p-4'>
				{notifications.map((n, i) => (
					<NotificationItem
						key={i}
						icon={typeIconMap[n.type] || FileText}
						title={n.title}
						message={n.message}
						time={n.time}
						read={n.read}
						onClick={() => handleClick(i)}
					/>
				))}
			</div>
		</div>
	);
};

export default NotificationList;
