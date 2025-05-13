import FriendClosetPage from '@/features/closet/pages/FriendClosetPage';

const FriendClosetLayoutPage = () => (
	<>
		{/* 모바일 레이아웃 */}
		<div className='block sm:hidden min-h-screen bg-white'>
			<FriendClosetPage />
		</div>

		{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
		<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
			<div className='w-[560px] h-screen bg-white rounded-xl overflow-hidden shadow-xl'>
				<div className='relative h-full flex flex-col'>
					<FriendClosetPage />
				</div>
			</div>
		</div>
	</>
);

export default FriendClosetLayoutPage;
