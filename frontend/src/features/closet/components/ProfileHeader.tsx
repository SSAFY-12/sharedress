import { PrimaryBtn } from '@/components/buttons/primary-button';
import Header from '@/components/layouts/Header';
import { authApi } from '@/features/auth/api/authApi';
import { useProfileStore } from '@/store/useProfileStore';
import { getOptimizedImageUrl } from '@/utils/imageUtils';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
	profileImage?: string;
	nickname?: string;
	code?: string;
	statusMessage?: string;
	isMe?: boolean;
	memberId?: number;
}

const backgroundImages = [
	'/images/backgrounds/1.jpg',
	'/images/backgrounds/2.jpg',
	'/images/backgrounds/3.jpg',
	'/images/backgrounds/4.jpg',
];

const ProfileHeader = ({
	profileImage,
	nickname,
	code,
	statusMessage,
	isMe,
	memberId,
}: ProfileHeaderProps) => {
	const isGuest = useProfileStore((state) => state.isGuest);
	const selectedBackgroundImage = useMemo(() => {
		const randomIndex = Math.floor(Math.random() * backgroundImages.length);
		return backgroundImages[randomIndex];
	}, []);
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

	const handleLogoutClick = () => {
		authApi.logout();
		navigate('/');
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
						backgroundImage: `url(${selectedBackgroundImage})`,
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
						<img src='/icons/logo_black.svg' alt='쉐어드레스' />
						<div className='flex gap-4'>
							<img
								src='/icons/logout_black.svg'
								alt='로그아웃'
								onClick={handleLogoutClick}
								className='cursor-pointer'
							/>
							<img
								src='/icons/notification_black.svg'
								alt='알림'
								onClick={handleNotificationClick}
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
						onBadgeClick={handleNotificationClick}
					/>
				)}
			</div>

			{/* 프로필 카드 컨테이너 */}
			{/* 얘도 따로 컴포넌트로 빼놔야 하나? */}
			<div className='relative px-4 pb-4 pt-8'>
				<div className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-20'>
					<div className='w-20 h-20 rounded-full overflow-hidden'>
						<img
							src={
								getOptimizedImageUrl(profileImage) ||
								'https://picsum.photos/200'
							}
							alt={`${nickname}#${code}의 프로필 이미지`}
							className='w-full h-full object-cover'
						/>
					</div>
				</div>
				{/* 프로필 카드 */}
				<div className='bg-white/70 backdrop-blur-sm rounded-xl pt-16 pb-6 shadow-sm border-white border-2'>
					<div className='flex flex-col items-center'>
						<h2 className='text-title font-bold mb-1 text-center'>
							<span className='text-regular'>{nickname}</span>
							<span className='text-low'>#{code}</span>
						</h2>
						<p className='text-description text-regular mb-4 text-center mt-2.5'>
							{statusMessage}
						</p>
						<div className='w-full px-4'>
							{isMe ? (
								<PrimaryBtn
									size='full'
									name='프로필 수정하기'
									onClick={() => handleProfileEditClick()}
									color='white'
								/>
							) : (
								<PrimaryBtn
									size='full'
									name='코디 추천하기'
									onClick={handleRecommendClick}
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
