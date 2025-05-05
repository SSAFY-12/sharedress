import { useState } from 'react';
import { MainModal } from '@/components/modals/main-modal/MainModal';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';
import { PrimaryBtn } from '@/components/buttons/primary-button';

interface FriendRequestMsgModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (msg: string) => void; // 친구 요청 메시지 제출
	friend: { profileImage: string; nickname: string }; // 친구정보
}

export const FriendRequestMsgModal = ({
	isOpen,
	onClose,
	onSubmit,
	friend, // 친구정보
}: FriendRequestMsgModalProps) => {
	const [msg, setMsg] = useState(''); // 친구 요청 메시지

	return (
		<MainModal
			isOpen={isOpen}
			onClose={onClose}
			overlayClassName='bg-black/80 backdrop-blur-sm' // 모달 배경 투명도 조절
		>
			<MainModal.Header>
				<MainModal.Body>
					<div className='flex flex-col items-center'>
						<UserMiniAvatar
							src={friend.profileImage}
							size='lg'
							className='mb-3'
						/>
						<h2 className='font-bold mb-1'>{friend.nickname}</h2>
						<label className='mt-4 mb-2 text-sm'>친구 요청 메시지</label>
						<input
							className='w-full border rounded px-3 py-2 mb-4'
							placeholder='메시지 입력'
							value={msg}
							onChange={(e) => setMsg(e.target.value)}
						/>
						<PrimaryBtn
							size='compact'
							name='친구 요청'
							color='black'
							className='w-full'
							onClick={() => {
								// 제출 버튼 클릭 시 친구 요청 메시지 제출 => 서버 요청 로직
								onSubmit(msg);
								setMsg('');
							}}
						/>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
