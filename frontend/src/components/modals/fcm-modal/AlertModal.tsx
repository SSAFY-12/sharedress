import { Bell } from 'lucide-react';
import { MainModal } from '../main-modal/MainModal';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	title?: string;
	description?: string;
	confirmText?: string;
}

export const AlertModal = ({
	isOpen,
	onClose,
	onConfirm,
	title = '알림 활성화 안내',
	description = '알림을 받으시려면 설정 페이지에서 알림을 활성화해 주세요.',
	confirmText = '설정으로 이동',
}: AlertModalProps) => (
	<MainModal isOpen={isOpen} onClose={onClose}>
		<MainModal.Header>
			<div className='flex flex-col items-center gap-2 pb-2'>
				<Bell className='w-10 h-10 text-blue-500' />
				<h3 className='text-lg font-bold'>{title}</h3>
			</div>
		</MainModal.Header>
		<MainModal.Body>
			<p className='text-center text-gray-700 mb-4'>{description}</p>
			<button
				className='w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition'
				onClick={onConfirm}
			>
				{confirmText}
			</button>
		</MainModal.Body>
	</MainModal>
);
