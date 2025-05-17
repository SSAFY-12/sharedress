import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { MainModal } from '@/components/modals/main-modal/MainModal';
import useRequest from '@/features/social/hooks/useRequest';
import { PrimaryBtn } from '@/components/buttons/primary-button';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

export interface FriendRequestActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	memberId: number; // 요청 조회를 위한 memberId
	friend: {
		profileImage: string;
		nickname: string;
		memberId: number;
	};
}

export const FriendRequestActionModal = ({
	isOpen,
	onClose,
	memberId,
	friend,
}: FriendRequestActionModalProps) => {
	const { friendRequest, acceptRequest, rejectRequest } = useRequest(
		isOpen ? memberId : undefined,
	); // 모달이 열려있을 때만 요청 조회

	const handleAction = async (type: 'accept' | 'reject') => {
		if (!friendRequest) return;

		try {
			if (type === 'accept') {
				acceptRequest(friendRequest.id);
			} else {
				rejectRequest(friendRequest.id);
			}
			onClose();
		} catch (error) {
			console.error('Failed to process friend request:', error);
			// 에러 처리 로직 추가 가능
		}
	};

	if (!friendRequest) return null;

	return (
		<MainModal
			isOpen={isOpen}
			onClose={onClose}
			overlayClassName='bg-black/80 backdrop-blur-sm'
		>
			<MainModal.Header>
				<MainModal.Body>
					<div className='flex flex-col items-center gap-6 mt-4'>
						<div className='flex flex-col items-center gap-2.5'>
							<UserMiniAvatar
								src={getOptimizedImageUrl(friend.profileImage)}
								size='lg'
							/>
							<h2 className='font-bold'>{friend.nickname}</h2>
						</div>
						<div className=' text-sm text-low text-center'>
							{friendRequest.message}
						</div>
						<div className='flex gap-4 w-full'>
							<PrimaryBtn
								size='medium'
								name='수락하기'
								color='primary'
								onClick={() => handleAction('accept')}
							/>
							<PrimaryBtn
								size='medium'
								name='거절하기'
								color='background'
								onClick={() => handleAction('reject')}
							/>
						</div>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
