import { MainModal } from '@/components/modals/main-modal/MainModal';

import { SwitchToggle } from '@/components/buttons/switch-toggle/SwitchToggle';
import { useEffect, useState, useMemo } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { useModifyProfile } from '../hooks/useModifyProfile';
import { usePublicLink } from '../hooks/usePublicLink';
import { shareLink } from '@/utils/share';
import { toast } from 'react-toastify';

interface ExternalShareModalProps {
	// 외부 코디 요청 모달 컴포넌트의 타입 정의
	isOpen: boolean; // 모달 열림 여부
	onClose: () => void; // 모달 닫기 함수
}

export const ExternalShareModal = ({
	isOpen,
	onClose,
}: ExternalShareModalProps) => {
	const isPublic = useProfileStore((state) => state.isPublic);
	const { mutate: modifyProfile } = useModifyProfile();
	const { publicLink } = usePublicLink();

	const handleToggle = () => {
		const newValue = !isPublic;
		modifyProfile({
			isPublic: newValue,
		});
	};

	const linkTitle = 'Sharedress - 내 옷장을 공유해요';
	const linkUrl = `https://sharedress.co.kr/link/${publicLink}`;
	const linkText = '나의 옷장을 보고 코디를 만들어 줘!';

	const handleCopyShare = async () => {
		if (!isPublic) return; // 비공개일 땐 막기
		const result = await shareLink({
			title: linkTitle,
			url: linkUrl,
			text: linkText,
		});

		if (result === 'copied') {
			toast.info('내 옷장 주소가 복사됐어요');
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
					<div className='flex flex-col items-center gap-[18px]'>
						<div className='flex flex-col justify-center items-center gap-1 w-full'>
							<img src='/images/social/share-profile.png' alt='profile' />
							<div className='flex flex-col justify-center items-center w-full'>
								<span className='text-regular text-topHeader'>
									링크를 복사해서
								</span>
								<div className='flex justify-center items-center w-full'>
									<span className='text-modify text-topHeader'>
										코디추천을 요청
									</span>
									<span className='text-regular text-topHeader'>해봐요</span>
								</div>
							</div>
						</div>
						<div className='flex flex-col justify-center items-center w-full gap-2'>
							<div className='flex justify-between items-center w-full p-2.5 borderborder-blue-500'>
								<span className='text-regular text-default'>프로필 공개</span>
								<SwitchToggle
									checked={isPublic ?? true}
									onToggle={handleToggle}
									variant='primary'
								/>
							</div>
							<div className='flex justify-between items-center w-full px-4 py-3.5 border border-light rounded-lg'>
								{isPublic ? (
									<>
										<span className='text-description text-default'>
											sharedress.co.kr/{publicLink}
										</span>
										<button
											type='button'
											className='p-0'
											onClick={handleCopyShare}
										>
											<img src='/icons/copy-np.svg' alt='copy' />
										</button>
									</>
								) : (
									<span className='text-description text-default text-center w-full'>
										공유하려면 프로필을 공개해야 합니다
									</span>
								)}
							</div>
						</div>
						<div className='h-1'></div>
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
