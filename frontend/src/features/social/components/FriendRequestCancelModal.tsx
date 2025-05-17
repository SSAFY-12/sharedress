import { MainModal } from '@/components/modals/main-modal/MainModal';
import useRequest from '../hooks/useRequest';
import { FriendRequestActionModalProps } from './FriendRequestActionModal';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { PrimaryBtn } from '@/components/buttons/primary-button';

export const FriendRequestCancelModal = ({
	isOpen,
	onClose,
	memberId,
	friend,
}: FriendRequestActionModalProps) => {
	const { friendRequest, cancelRequest } = useRequest(
		isOpen ? memberId : undefined,
	);

	const handleCancel = () => {
		if (!friendRequest) return;

		try {
			cancelRequest(friendRequest.id);
			onClose();
		} catch (error) {
			console.error('Failed to cancel friend request:', error);
		}
	};

	if (!friendRequest) return null;

	return (
		<MainModal isOpen={isOpen} onClose={onClose}>
			<MainModal.Header>
				<MainModal.Body>
					<div className='flex flex-col items-center gap-6 mt-4'>
						<UserMiniAvatar
							src={getOptimizedImageUrl(friend.profileImage)}
							size='lg'
						/>
						<h2 className='font-bold'>{friend.nickname}</h2>
						<PrimaryBtn
							size='medium'
							name='요청 취소'
							color='primary'
							onClick={handleCancel}
						/>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
