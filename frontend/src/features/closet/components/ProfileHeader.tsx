import { PrimaryBtn } from '@/components/buttons/primary-button';
import Header from '@/components/layouts/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
	profileImage?: string;
	nickname?: string;
	code?: string;
	statusMessage?: string;
	isMe?: boolean;
	memberId?: number;
	handleModalOpen?: () => void;
	onExternalRequestClick?: () => void;
}

const backgroundImages = [
	'/images/backgrounds/1.jpg',
	'/images/backgrounds/2.jpg',
	'/images/backgrounds/3.jpg',
	'/images/backgrounds/4.jpg',
	'/images/backgrounds/5.jpg',
	'/images/backgrounds/6.jpg',
	'/images/backgrounds/7.jpg',
	'/images/backgrounds/8.jpg',
	'/images/backgrounds/9.jpg',
	'/images/backgrounds/10.jpg',
	'/images/backgrounds/11.jpg',
	'/images/backgrounds/12.jpg',
	'/images/backgrounds/13.jpg',
	'/images/backgrounds/14.jpg',
];

const ProfileHeader = ({
	profileImage,
	nickname,
	code,
	statusMessage,
	isMe,
	memberId,
	onExternalRequestClick,
}: // handleModalOpen,
ProfileHeaderProps) => {
	const isGuest = useAuthStore((state) => state.isGuest);
	const navigate = useNavigate();

	const handleRecommendClick = () => {
		if (!memberId) return;

		navigate('/codi/edit', {
			state: {
				mode: 'recommended',
				targetMemberId: memberId.toString(),
			},
		});
	};

	const handleGuestRecommendClick = () => {
		if (!memberId) return;
		navigate('/link/codi/edit', {
			state: {
				mode: 'recommended',
				targetMemberId: memberId.toString(),
			},
		});
	};

	const handleSettingClick = () => {
		navigate('/setting');
	};

	const handleNotificationClick = () => {
		navigate('/notification');
	};

	const handleProfileEditClick = () => {
		navigate('/mypage/edit');
	};

	const handleSignUpClick = () => {
		navigate('/auth');
	};

	const handleBackClick = () => {
		navigate('/social');
	};

	return (
		<div className='relative w-full min-h-[37.5vh]'>
			<div className='absolute inset-0 overflow-hidden'>
				<div
					className='absolute inset-0'
					style={{
						backgroundImage: isMe
							? `url(${backgroundImages[2]})`
							: `url(${backgroundImages[1]})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						filter: 'blur(2px)',
						transform: 'scale(1.1)',
					}}
				></div>
				{/* 배경 오버레이 */}
				<div className='absolute inset-0'></div>
			</div>

			{/* 헤더 */}
			<div className='relative z-10'>
				{isMe ? (
					<header className='flex items-center justify-between h-16 px-4 bg-transparent'>
						<img src='/icons/logo_white.svg' alt='쉐어드레스' />
						<div className='flex gap-4'>
							<img
								src='/icons/notification_white.svg'
								alt='알림'
								onClick={handleNotificationClick}
								className='cursor-pointer'
							/>
							<img
								src='/icons/header_setting.svg'
								alt='설정'
								onClick={handleSettingClick}
								className='cursor-pointer'
							/>
						</div>
					</header>
				) : isGuest ? (
					<Header
						logo='쉐어드레스'
						signUp={true}
						onSignUpClick={handleSignUpClick}
					/>
				) : (
					<Header
						showBack={true}
						onBackClick={handleBackClick}
						closet={true}
						onBadgeClick={handleNotificationClick}
					/>
				)}
			</div>

			{/* 프로필 카드 컨테이너 */}
			<div className='relative px-4 pb-4 pt-8 z-30'>
				<div className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-40'>
					<div className='w-20 h-20 rounded-full overflow-hidden'>
						<img
							src={
								getOptimizedImageUrl(profileImage) ||
								'/images/default_profile.png'
							}
							alt={`${nickname}#${code}의 프로필 이미지`}
							className='w-full h-full object-cover'
						/>
					</div>
				</div>
				{/* 프로필 카드 */}
				<div className='bg-white/70 backdrop-blur-sm rounded-xl pt-16 pb-6 shadow-sm border-white border-2 relative z-30'>
					<div className='flex flex-col items-center'>
						<h2 className='mb-1 text-center'>
							<span className=' text-title text-regular'>{nickname}</span>
							<span className='text-titleThin text-low'>#{code}</span>
						</h2>
						<p className='text-description text-regular mb-4 text-center mt-2.5'>
							{statusMessage}
						</p>
						<div className='w-full px-4'>
							{isMe ? (
								<div className='flex gap-2'>
									<PrimaryBtn
										size='double'
										name='프로필 편집'
										onClick={() => handleProfileEditClick()}
										color='white'
									/>
									<PrimaryBtn
										size='double'
										name='내 옷장 공유'
										onClick={() => onExternalRequestClick?.()}
										color='semibrown'
										className='z-50'
									/>
								</div>
							) : (
								<PrimaryBtn
									size='medium'
									name='코디 추천하기'
									onClick={() => {
										if (!isGuest) {
											handleRecommendClick();
										} else {
											handleGuestRecommendClick();
										}
									}}
									color='white'
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
