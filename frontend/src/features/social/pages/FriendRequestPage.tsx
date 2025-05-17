import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { useState, useEffect } from 'react';
import { FriendRequestActionModal } from '@/features/social/components/FriendRequestActionModal';
import useRequest from '@/features/social/hooks/useRequest';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

// 메인 컴포넌트
export const FriendRequestsPage = () => {
	const { friendRequests } = useRequest();

	// 모달 관련 상태
	const [actionModalOpen, setActionModalOpen] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState<{
		id: number;
		profileImage: string;
		nickname: string;
		memberId: number;
	} | null>(null);
	// 모바일 여부 감지
	const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 500);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// const handleActionClick = (type: 'accept' | 'reject', request: any) => {
	// 	setActionType(type);
	// 	setSelectedRequest({
	// 		id: request.id,
	// 		profileImage: request.requester.profileImage,
	// 		nickname: request.requester.nickname,
	// 		memberId: request.requester.id,
	// 	});
	// 	setActionModalOpen(true);
	// };
	console.log('friendRequests', friendRequests);
	return (
		<div className='w-full bg-white flex flex-col items-stretch'>
			{/* 친구 요청 목록 */}
			<div className='p-4'>
				{friendRequests && friendRequests.length > 0 ? (
					friendRequests.map((request) => (
						<div
							key={request.id}
							className='relative mb-4 pb-4 border-b border-gray-100 px-2 sm:px-4'
						>
							<div className='flex items-center justify-between'>
								<div className='flex items-center text-left'>
									<UserMiniAvatar
										src={getOptimizedImageUrl(request.requester.profileImage)}
										size='md'
									/>
									<div className='ml-3 flex-1'>
										<h3 className='font-medium text-button'>
											{isMobile && request.requester.nickname.length > 7
												? request.requester.nickname.slice(0, 7) + '...'
												: request.requester.nickname}
										</h3>
										<p className='text-sm text-gray-500 text-description'>
											{isMobile && request.message.length > 7
												? request.message.slice(0, 7) + '...'
												: request.message}
										</p>
									</div>
								</div>
								<div className='flex gap-2'>
									<PrimaryBtn
										size='tiny'
										name='확인하기'
										color='brown'
										onClick={() => {
											setSelectedRequest({
												id: request.id,
												profileImage:
													request.requester.profileImage ??
													'/images/default_profile.png',
												nickname: request.requester.nickname,
												memberId: request.requester.id,
											});
											setActionModalOpen(true);
										}}
									/>
									{/* <PrimaryBtn
										size='tiny'
										name='친구 수락'
										color='brown'
										onClick={() => handleActionClick('accept', request)}
									/>
									<PrimaryBtn
										size='tiny'
										name='친구 거절'
										color='background'
										onClick={() => handleActionClick('reject', request)}
									/> */}
								</div>
							</div>
						</div>
					))
				) : (
					<div className='flex items-center justify-center h-full'>
						<p className='text-description text-descriptionColor'>
							현재 들어온 친구 요청이 없습니다.
						</p>
					</div>
				)}
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
					// actionType={actionType}
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
