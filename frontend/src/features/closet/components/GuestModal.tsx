import { MainModal } from '@/components/modals/main-modal/MainModal';
import GoogleAuthPage from '@/features/auth/pages/GoogleAuthPage';
import { useMemo } from 'react';

interface GuestModalProps {
	// 외부 코디 요청 모달 컴포넌트의 타입 정의
	isOpen: boolean; // 모달 열림 여부
	onClose: () => void; // 모달 닫기 함수
}

export const GuestModal = ({ isOpen, onClose }: GuestModalProps) => {
	const randomMessage = useMemo(() => {
		const messages = [
			{
				line1: '옷 하나하나 등록하기가 귀찮았다면?',
				line2: {
					before: '',
					highlight: '구매내역으로 한 번에 등록',
					after: '해보기',
				},
			},
			{
				line1: '혹시 중요한 약속을 앞두고 있다면?',
				line2: {
					before: '회원가입해서',
					highlight: '코디 조르기',
					after: '',
				},
			},
		];

		return messages[Math.floor(Math.random() * messages.length)];
	}, []);

	return (
		<MainModal
			isOpen={isOpen}
			onClose={onClose}
			overlayClassName='bg-black/80 backdrop-blur-sm' // 모달 배경 투명도 조절
		>
			<MainModal.Header>
				<MainModal.Body>
					<div className='flex flex-col items-center gap-[18px] pb-2.5'>
						<div className='flex flex-col justify-center items-center gap-1 w-full'>
							<img src='/images/social/share-profile.png' alt='profile' />
							<div className='flex flex-col justify-center items-center w-full'>
								<span className='text-regular text-topHeader'>
									{randomMessage.line1}
								</span>
								<div className='flex justify-center items-center w-full'>
									{randomMessage.line2.before && (
										<>
											<span className='text-regular text-topHeader'>
												{randomMessage.line2.before}
											</span>
											<span className='text-regular text-topHeader'>
												&nbsp;
											</span>
										</>
									)}
									<span className='text-modify text-topHeader'>
										{randomMessage.line2.highlight}
									</span>
									{randomMessage.line2.after && (
										<span className='text-regular text-topHeader'>
											{randomMessage.line2.after}
										</span>
									)}
								</div>
							</div>
						</div>
						<div className='flex flex-col justify-center items-center w-full gap-2'>
							<GoogleAuthPage />
						</div>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
