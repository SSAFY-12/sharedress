import { MainModal } from '@/components/modals/main-modal/MainModal';

import { SwitchToggle } from '@/components/buttons/switch-toggle/SwitchToggle';
import { useProfileStore } from '@/store/useProfileStore';
import { useModifyProfile } from '@/features/social/hooks/useModifyProfile';
import { usePublicLink } from '@/features/social/hooks/usePublicLink';
import { shareLink } from '@/utils/share';

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
	const nickname = useProfileStore((state) => state.nickname);
	const oneLiner = useProfileStore((state) => state.oneLiner);
	const { mutate: modifyProfile } = useModifyProfile();
	const { publicLink } = usePublicLink();

	const handleToggle = () => {
		const newValue = !isPublic;
		modifyProfile({
			nickname: nickname ?? ' ',
			oneLiner: oneLiner ?? ' ',
			isPublic: newValue,
		});
	};

	const linkTitle = '👗 Sharedress - 내 옷장을 꾸며줘!';

	// const linkUrl = `https://sharedress.co.kr/link/${publicLink}`;
	const isProd = import.meta.env.MODE === 'production';
	const linkUrl = isProd
		? `https://sharedress.co.kr/link/${publicLink}`
		: `https://localhost:5173/link/${publicLink}`;
	const linkText =
		'친구야, 나의 옷장을 열어봤어?\n👀 너의 센스로 멋진 코디를 부탁해! ✨\n🧥(크롬 혹은 사파리리 접속을 권장합니다)👖';

	const handleCopy = async () => {
		if (!isPublic) return; // 비공개일 땐 막기
		const result = await shareLink({
			title: linkTitle,
			url: linkUrl,
			text: linkText,
		});

		if (result === 'copied') {
			if ('serviceWorker' in navigator && 'Notification' in window) {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification('복사 완료', {
					body: '내 옷장 주소가 복사됐어요',
					icon: '/android-chrome-192x192.png',
					badge: '/favicon-32x32.png',
				});
			}
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
					<div className='flex flex-col items-center gap-[18px] pb-2.5'>
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
										<button type='button' className='p-0' onClick={handleCopy}>
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
					</div>
				</MainModal.Body>
			</MainModal.Header>
		</MainModal>
	);
};
