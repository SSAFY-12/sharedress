import { MainModal } from '@/components/modals/main-modal/MainModal';
import GoogleAuthPage from '@/features/auth/pages/GoogleAuthPage';

interface GuestModal2Props {
	isOpen: boolean;
	onClose: () => void;
}

export const GuestModal2 = ({ isOpen, onClose }: GuestModal2Props) => (
	<MainModal
		isOpen={isOpen}
		onClose={onClose}
		overlayClassName='bg-black/80 backdrop-blur-sm'
	>
		<MainModal.Header>
			<MainModal.Body>
				<div className='flex flex-col items-center gap-[18px] pb-2.5'>
					<div className='flex flex-col justify-center items-center gap-1 w-full'>
						<img src='/images/social/share-profile.png' alt='profile' />
						<div className='flex flex-col justify-center items-center w-full'>
							<span className='text-regular text-topHeader'>
								혹시 중요한 약속을 앞두고 있다면?
							</span>
							<div className='flex justify-center items-center w-full'>
								<span className='text-regular text-topHeader'>
									회원가입해서
								</span>
								<span className='text-regular text-topHeader'>&nbsp;</span>
								<span className='text-modify text-topHeader'>코디 조르기</span>
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
