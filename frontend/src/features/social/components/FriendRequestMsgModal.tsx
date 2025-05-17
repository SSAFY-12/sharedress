import React from 'react';
import { MainModal } from '@/components/modals/main-modal/MainModal';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';
import { PrimaryBtn } from '@/components/buttons/primary-button';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { Info } from 'lucide-react';

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
}: FriendRequestMsgModalProps) => {
	// console.log('friendRequestMsgModal 랜더링 :', friend); // memberId 값만 로깅
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (value.length <= 30) {
			onMessageChange(value);
		}
	};
	return (
		<MainModal
			isOpen={isOpen}
			onClose={onClose}
			overlayClassName='bg-black/80 backdrop-blur-sm' // 모달 배경 투명도 조절
		>
			<MainModal.Header>
				<MainModal.Body>
					<div className='flex flex-col items-center mt-4'>
						<UserMiniAvatar
							src={getOptimizedImageUrl(friend.profileImage)}
							size='lg'
							className='mb-2.5'
						/>
						<h2 className='text-smallButton text-regular mb-6'>
							{friend.nickname}
						</h2>
						<label className='w-full mb-2.5 text-regular text-description text-left'>
							친구 요청 메시지(30자 이하)
						</label>
						<input
							className='text-default text-regular placeholder:text-descriptionColor text-left flex justify-between items-center px-4 py-2.5 bg-background h-12 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-light disabled:bg-background'
							placeholder='메시지 입력'
							value={message}
							onChange={handleInputChange}
						/>

						<div className='flex justify-between items-center w-full text-xs mb-6 mt-2'>
							{message.length === 30 ? (
								<span className='flex gap-1.5 items-center text-delete text-smallDescription'>
									<Info size={14} />
									30자까지 입력 가능합니다
								</span>
							) : (
								<span />
							)}

							<span className='text-descriptionColor text-smallDescription'>
								{message.length} / 30
							</span>
						</div>

						<PrimaryBtn
							size='medium'
							name='친구 요청'
							color='primary'
							onClick={onConfirm}
						/>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
