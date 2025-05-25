import { MainModal } from '@/components/modals/main-modal/MainModal';

interface CodiTutorialModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const CodiTutorialModal = ({
	isOpen,
	onClose,
}: CodiTutorialModalProps) => (
	<MainModal isOpen={isOpen} onClose={onClose} className='max-w-sm'>
		<MainModal.Header showCloseButton={true}>
			<MainModal.Body>
				<div className='flex flex-col items-center gap-4 py-2'>
					{/* 영상 영역 */}
					<div className='w-full rounded-lg overflow-hidden bg-gray-100 mt-4'>
						<video
							autoPlay
							loop
							muted
							playsInline
							className='w-full h-auto object-cover'
						>
							<source src='/videos/codi-tutorial.mp4' type='video/mp4' />
							{/* 영상이 로드되지 않을 경우 대체 텍스트 */}
							코디 만들기 튜토리얼 영상을 불러올 수 없습니다.
						</video>
					</div>

					{/* 설명 문구 */}
					<div className='text-center'>
						<p className='text-regular text-topHeader leading-relaxed'>
							아이템을 선택하여
						</p>
						<p className='text-regular text-topHeader leading-relaxed'>
							자유롭게 코디를 만들어보세요
						</p>
					</div>
				</div>
			</MainModal.Body>
		</MainModal.Header>
	</MainModal>
);
