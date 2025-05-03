import { PrimaryBtn } from '@/components/buttons/primary-button';
import Header from '@/components/layouts/Header';

interface ProfileHeaderProps {
	profileImage?: string;
	username?: string;
	statusMessage?: string;
}

const ProfileHeader = ({
	profileImage,
	username,
	statusMessage,
}: ProfileHeaderProps) => (
	<div className='relative'>
		<div
			className='absolute inset-0'
			style={{
				backgroundImage: "url('https://picsum.photos/200/300')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				filter: 'blur(2px)',
			}}
		></div>

		{/* 배경 오버레이 */}
		<div className='absolute inset-0'></div>

		{/* 헤더 */}
		<div className='relative z-10'>
			<Header logo='쉐어드레스' badgeIcon='bell' />
		</div>

		{/* 프로필 카드 컨테이너 */}
		{/* 얘도 따로 컴포넌트로 빼놔야 하나? */}
		<div className='relative px-4 pb-4 pt-12'>
			<div className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20'>
				<div className='w-24 h-24 rounded-full overflow-hidden'>
					<img
						src={profileImage || 'https://picsum.photos/200'}
						alt={`${username}의 프로필 이미지`}
						className='w-full h-full object-cover'
					/>
				</div>
			</div>
			{/* 프로필 카드 */}
			<div className='bg-white/70 backdrop-blur-sm rounded-xl pt-16 pb-6 shadow-sm'>
				<div className='flex flex-col items-center'>
					<h2 className='text-xl font-bold mb-1 text-center'>{username}</h2>
					<p className='text-[#6b6767] text-sm mb-6 text-center'>
						{statusMessage}
					</p>
					<div className='w-full px-4'>
						<PrimaryBtn
							size='full'
							name='프로필 수정하기'
							onClick={() => console.log('프로필 수정 클릭')}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default ProfileHeader;
