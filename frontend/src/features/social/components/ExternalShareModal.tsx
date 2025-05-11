import { MainModal } from '@/components/modals/main-modal/MainModal';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar/UserMiniAvatar';
import { PrimaryBtn } from '@/components/buttons/primary-button';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { SwitchToggle } from '@/components/buttons/switch-toggle/SwitchToggle';
import { useEffect, useState } from 'react';

interface ExternalShareModalProps {
	// 외부 코디 요청 모달 컴포넌트의 타입 정의
	isOpen: boolean; // 모달 열림 여부
	onClose: () => void; // 모달 닫기 함수
}

// modal 내역 로그
export const ExternalShareModal = ({
	isOpen,
	onClose,
}: ExternalShareModalProps) => {
	/*
	현재 공개링크 발긍 상태 여부 확인하는 api 필요 
	*/
	const [isChecked, setIsChecked] = useState(false);
	useEffect(() => {}, [isChecked]);

	return (
		<MainModal
			isOpen={isOpen}
			onClose={onClose}
			overlayClassName='bg-black/80 backdrop-blur-sm' // 모달 배경 투명도 조절
		>
			<MainModal.Header>
				<MainModal.Body>
					<div className='flex flex-col items-center'>
						<div className='flex justify-between items-center w-full p-2.5'>
							<span className='text-regular text-default'>프로필 공개</span>
							<SwitchToggle
								checked={isChecked}
								onToggle={() => setIsChecked(!isChecked)}
								variant='primary'
							/>
						</div>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
