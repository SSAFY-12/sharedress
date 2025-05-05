import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { useSwipeable } from 'react-swipeable'; // 밀어서 거절 기능
import { useState } from 'react';
import useRequest from '@/features/social/hooks/useRequest';

// const [friendRequests, setFriendRequests] = useState([
// 	{
// 		id: 1,
// 		name: '예승아기',
// 		avatar: 'https://picsum.photos/200/300?random=1',
// 		message: '나 갓긴데 안받아줄거야?',
// 	},
// 	{
// 		id: 2,
// 		name: '예승아기',
// 		avatar: 'https://picsum.photos/200/300?random=2',
// 		message: '나 갓긴데 안받아줄거야?',
// 	},
// ]);

// 메인 컴포넌트
export const FriendRequestsPage = () => {
	// 친구 요청 목록 조회 -> 요청 수락 / 거절 : 밀어서 거절
	// const { friendRequests, isFriendRequestsLoading, friendRequestsError } =
	const { friendRequests, acceptRequest, rejectRequest } = useRequest(); // 친구 요청 전체 목록 조회
	//		id: number; //친구 요청 고유 아이디
	//		message: string; //메시지
	//		requester: object; //요청자 정보(사람)
	const [swipedId, setSwipedId] = useState<number | null>(null); // 밀어서 거절 기능 === 거절할 친구 id

	//id, message, requester

	// 매개변수에는 friendRequest 를 전달하게 되어있었음
	const handleAccept = (id: number) => {
		// 친구 요청 수락
		acceptRequest({ requestId: id });
	};

	const handleReject = (id: number) => {
		// 친구 요청 거절
		setSwipedId(null);
		rejectRequest({ requestId: id });
	};

	// 밀어서 거절 기능
	const swipeHandlers = useSwipeable({
		onSwipedLeft: () => {
			// 왼쪽으로 밀면 거절
			setSwipedId(null);
		},
		trackMouse: true, // 마우스 움직임 추적
	});

	return (
		<div className='flex flex-col h-full max-w-md mx-auto bg-white'>
			{/* 친구 요청 목록 */}
			<div className='flex-1 p-4'>
				{friendRequests?.map(
					(
						request, // 친구 요청 목록 렌더링
					) => (
						<div
							key={request.id} // 친구 요청 목록 렌더링
							{...swipeHandlers} // 밀어서 거절 기능
							data-id={request.id} // 친구 요청 목록 렌더링
							className='relative mb-4 pb-4' // 친구 요청 목록 렌더링
						>
							{/* 삭제 버튼 */}
							<div
								className='absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 rounded-l-lg cursor-pointer transition-opacity duration-300'
								style={{
									opacity: swipedId === request.id ? 1 : 0, // 투명도 조절
									pointerEvents: swipedId === request.id ? 'auto' : 'none', // 포인터 이벤트 처리
								}}
								onClick={() => handleReject(request.id)} // 밀어서 거절 기능
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6 text-white'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
									/>
								</svg>
							</div>
							<div
								className='flex items-center justify-between relative cursor-pointer transition-transform duration-300'
								style={{
									transform:
										swipedId === request.id
											? 'translateX(80px)'
											: 'translateX(0)',
								}}
							>
								<div className='flex items-center text-left'>
									<UserMiniAvatar
										src={request.requester.profileImage}
										size='md'
									/>
									<div className='ml-3 flex-1'>
										<h3 className='font-medium text-button'>
											{request.requester.nickname}
										</h3>
										<p className='text-sm text-gray-500 text-description'>
											{request.message}
										</p>
									</div>
								</div>
								<PrimaryBtn
									size='compact'
									name='친구 수락'
									// 친구 거절
									color='black'
									onClick={() => handleAccept(request.id)} // 친구 요청 수락
								/>
							</div>
						</div>
					),
				)}
			</div>
		</div>
	);
};
