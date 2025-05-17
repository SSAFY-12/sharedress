import { MainModal } from '@/components/modals/main-modal/MainModal';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	onHide?: () => void;
	title?: string;
	description?: string;
	confirmText?: string;
	hideText?: string;
}

export const AlertModal = ({
	isOpen,
	onClose,
	onConfirm,
	onHide,
	title = '알림 활성화 안내',
	description = `알림을 받기 위해
설정 페이지에서 활성화해 주세요`,
	confirmText = '설정으로 이동',
	hideText = '다신 안보기',
}: AlertModalProps) => (
	<MainModal isOpen={isOpen} onClose={onClose}>
		<MainModal.Header>
			<div className='flex flex-col items-center gap-2 pb-2'>
				<img src='/icons/toast_bell.png' alt='fcm' className='w-12 h-12 my-2' />
				<span className='text-regular text-title'>{title}</span>
			</div>
		</MainModal.Header>
		<MainModal.Body>
			<p className='text-low text-default whitespace-pre-line mb-5'>
				{description}
			</p>
			<div className='flex gap-2'>
				<button
					className='flex-1 w-full px-4 py-3 text-smallButton text-regualr bg-brownButton hover:bg-brownButton/80 text-white'
					onClick={onConfirm}
				>
					{confirmText}
				</button>
				<button
					className='flex-1 w-full px-4 py-3 text-smallButton bg-background hover:bg-light text-regular rounded-md font-semibold transition'
					onClick={onHide}
				>
					{hideText}
				</button>
			</div>
		</MainModal.Body>
	</MainModal>
);
