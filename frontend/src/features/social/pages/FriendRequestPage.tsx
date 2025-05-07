import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { useSwipeable } from 'react-swipeable'; // 밀어서 거절 기능
import { useState } from 'react';
import useRequest from '@/features/social/hooks/useRequest';
import { FriendRequestActionModal } from '@/features/social/components/FriendRequestActionModal';

// 메인 컴포넌트
export const FriendRequestsPage = () => {
	const { friendRequests } = useRequest();
	const [swipedId, setSwipedId] = useState<number | null>(null);

	// 모달 관련 상태
	const [actionModalOpen, setActionModalOpen] = useState(false);
	const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
	const [selectedRequest, setSelectedRequest] = useState<{
		id: number;
		profileImage: string;
		nickname: string;
		memberId: number;
	} | null>(null);

	const handleActionClick = (type: 'accept' | 'reject', request: any) => {
		setActionType(type);
		setSelectedRequest({
			id: request.id,
			profileImage: request.requester.profileImage,
			nickname: request.requester.nickname,
			memberId: request.requester.id,
		});
		setActionModalOpen(true);
	};

	// 밀어서 거절 기능
	const swipeHandlers = useSwipeable({
		onSwipedLeft: () => {
			setSwipedId(null);
		},
		trackMouse: true,
	});

	return (
		<div className='flex flex-col h-full max-w-md mx-auto bg-white'>
			{/* 친구 요청 목록 */}
			<div className='flex-1 p-4'>
				{friendRequests?.map((request) => (
					<div
						key={request.id}
						{...swipeHandlers}
						data-id={request.id}
						className='relative mb-4 pb-4'
					>
						{/* 삭제 버튼 */}
						<div
							className='absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 rounded-l-lg cursor-pointer transition-opacity duration-300'
							style={{
								opacity: swipedId === request.id ? 1 : 0,
								pointerEvents: swipedId === request.id ? 'auto' : 'none',
							}}
							onClick={() => handleActionClick('reject', request)}
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
								color='black'
								onClick={() => handleActionClick('accept', request)}
							/>
						</div>
					</div>
				))}
			</div>

			{/* 친구 요청 수락/거절 모달 */}
			{selectedRequest && (
				<FriendRequestActionModal
					isOpen={actionModalOpen}
					onClose={() => {
						setActionModalOpen(false);
						setSelectedRequest(null);
					}}
					memberId={selectedRequest.memberId}
					actionType={actionType}
					friend={{
						profileImage: selectedRequest.profileImage,
						nickname: selectedRequest.nickname,
						memberId: selectedRequest.memberId,
					}}
				/>
			)}
		</div>
	);
};
