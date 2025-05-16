import { Bell } from 'lucide-react';
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
	description = '알림을 받으시려면 설정 페이지에서 알림을 활성화해 주세요.',
	confirmText = '설정으로 이동',
	hideText = '다신 안보기',
}: AlertModalProps) => (
	<MainModal isOpen={isOpen} onClose={onClose}>
		<MainModal.Header>
			<div className='flex flex-col items-center gap-2 pb-2'>
				<Bell className='w-10 h-10 text-black' />
				<h3 className='text-lg font-bold'>{title}</h3>
			</div>
		</MainModal.Header>
		<MainModal.Body>
			<p className='text-center text-gray-700 mb-4'>{description}</p>
			<div className='flex gap-2'>
				<button
					className='flex-1 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition'
					onClick={onConfirm}
				>
					{confirmText}
				</button>
				<button
					className='flex-1 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition'
					onClick={onHide}
				>
					{hideText}
				</button>
			</div>
		</MainModal.Body>
	</MainModal>
);
