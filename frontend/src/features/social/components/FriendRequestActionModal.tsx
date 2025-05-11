import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { MainModal } from '@/components/modals/main-modal/MainModal';
import useRequest from '@/features/social/hooks/useRequest';
import { PrimaryBtn } from '@/components/buttons/primary-button';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

interface FriendRequestActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	memberId: number; // 요청 조회를 위한 memberId
	actionType: 'accept' | 'reject' | 'cancel';
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
	actionType,
	friend,
}: FriendRequestActionModalProps) => {
	const { friendRequest, acceptRequest, rejectRequest, cancelRequest } =
		useRequest(isOpen ? memberId : undefined); // 모달이 열려있을 때만 요청 조회

	const handleAction = async () => {
		if (!friendRequest) return;

		try {
			switch (actionType) {
				case 'accept':
					acceptRequest(friendRequest.id); // 친구 요청 수락
					break;
				case 'reject':
					rejectRequest(friendRequest.id); // 친구 요청 거절
					break;
				case 'cancel':
					cancelRequest(friendRequest.id); // 친구 요청 취소
					break;
			}
			onClose();
		} catch (error) {
			console.error('Failed to process friend request:', error);
			// 에러 처리 로직 추가 가능
		}
	};

	const getActionButtonText = () => {
		switch (actionType) {
			case 'accept':
				return '요청 수락';
			case 'reject':
				return '요청 거절';
			case 'cancel':
				return '요청 취소';
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
					<div className='flex flex-col items-center'>
						<UserMiniAvatar
							src={getOptimizedImageUrl(friend.profileImage)}
							size='lg'
							className='mb-3'
						/>
						<h2 className='font-bold mb-1'>{friend.nickname}</h2>
						<div className='mt-4 mb-2 text-sm text-gray-600'>
							{friendRequest.message}
						</div>
						<PrimaryBtn
							size='compact'
							name={getActionButtonText()}
							color='black'
							className='w-full'
							onClick={handleAction}
						/>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
