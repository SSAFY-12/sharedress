import { MainModal } from '@/components/modals/main-modal/MainModal';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';
import { PrimaryBtn } from '@/components/buttons/primary-button';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

interface FriendRequestMsgModalProps {
	// 친구 요청 메시지 모달 컴포넌트의 타입 정의
	isOpen: boolean; // 모달 열림 여부
	onClose: () => void; // 모달 닫기 함수
	friend: {
		profileImage: string; // 친구 프로필 이미지
		nickname: string; // 친구 닉네임
		receiverId: number; // 친구 요청 받는 사람의 ID
	};
	message: string;
	onMessageChange: (message: string) => void;
	onConfirm: () => void;
}

// modal 내역 로그
export const FriendRequestMsgModal = ({
	isOpen,
	onClose,
	friend,
	message,
	onMessageChange,
	onConfirm,
}: FriendRequestMsgModalProps) => (
	// console.log('friendRequestMsgModal 랜더링 :', friend); // memberId 값만 로깅
	<MainModal
		isOpen={isOpen}
		onClose={onClose}
		overlayClassName='bg-black/80 backdrop-blur-sm' // 모달 배경 투명도 조절
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
					<label className='mt-4 mb-2 text-sm text-left'>
						친구 요청 메시지(10자 제한)
					</label>
					<input
						className='w-full border rounded px-3 py-2 mb-4'
						placeholder='메시지 입력'
						value={message}
						onChange={(e) => {
							if (e.target.value.length <= 10) {
								onMessageChange(e.target.value);
							}
						}}
					/>
					<PrimaryBtn
						size='compact'
						name='친구 요청'
						color='black'
						className='w-full bg-[#3A3636] text-white mt-2'
						onClick={onConfirm}
					/>
				</div>
			</MainModal.Body>
		</MainModal.Header>
	</MainModal>
);
