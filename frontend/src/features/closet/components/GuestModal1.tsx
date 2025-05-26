import { MainModal } from '@/components/modals/main-modal/MainModal';
import GoogleAuthPage from '@/features/auth/pages/GoogleAuthPage';

interface GuestModal1Props {
	isOpen: boolean;
	onClose: () => void;
}

export const GuestModal1 = ({ isOpen, onClose }: GuestModal1Props) => (
	<MainModal
		isOpen={isOpen}
		onClose={onClose}
		overlayClassName='bg-black/80 backdrop-blur-sm'
	>
		<MainModal.Header>
			<MainModal.Body>
				<div className='flex flex-col items-center gap-[18px] pb-2.5'>
					<div className='flex flex-col justify-center items-center gap-1 w-full'>
						<img
							src='/images/social/cloth-scan.png'
							alt='profile'
							className='mt-4'
						/>
						<div className='mt-6 flex flex-col justify-center items-center w-full'>
							<span className='text-regular text-topHeader'>
								옷 하나하나 등록하기가 귀찮았다면?
							</span>
							<div className='flex justify-center items-center w-full'>
								<span className='text-modify text-topHeader'>
									구매내역으로 한 번에 등록
								</span>
								<span className='text-regular text-topHeader'>해보기</span>
							</div>
						</div>
					</div>
					<div className='flex flex-col justify-center items-center w-full gap-2'>
						<GoogleAuthPage id='signupA' />
					</div>
				</div>
			</MainModal.Body>
		</MainModal.Header>
	</MainModal>
);
