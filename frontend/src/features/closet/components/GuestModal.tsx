import { MainModal } from '@/components/modals/main-modal/MainModal';
import GoogleAuthPage from '@/features/auth/pages/GoogleAuthPage';

interface GuestModalProps {
	// 외부 코디 요청 모달 컴포넌트의 타입 정의
	isOpen: boolean; // 모달 열림 여부
	onClose: () => void; // 모달 닫기 함수
}

export const GuestModal = ({ isOpen, onClose }: GuestModalProps) => (
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
							<span className='text-regular text-topHeader'>회원가입해서</span>
							<div className='flex justify-center items-center w-full'>
								<span className='text-modify text-topHeader'>
									친구에게 코디를 추천
								</span>
								<span className='text-regular text-topHeader'>해봐요</span>
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
