import { ChevronLeft, Search, Plus } from 'lucide-react';

const FriendRequest = () => (
	<div className='w-full max-w-md'>
		<div className='h-[580px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='flex items-center p-4'>
				<ChevronLeft className='h-5 w-5 text-gray-500' />
				<span className='ml-2 font-medium'>친구에게 코디 요청</span>
			</div>

			<div className='h-[520px] overflow-y-auto p-4 pt-0'>
				<div className='relative mb-4'>
					<Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
					<input
						type='text'
						placeholder='친구 검색'
						className='w-full rounded-full bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none'
					/>
				</div>

				<div className='space-y-3'>
					{[
						{
							name: '쉐',
							status: '팔로잉',
							avatar: 'bg-blue-400',
						},
						{ name: '어', status: '아리랑', avatar: 'bg-pink-200' },
						{ name: '드', status: '아리랑', avatar: 'bg-gray-300' },
						{
							name: '레',
							status: 'A705에서 한 프로필 봐사주세요',
							avatar: 'bg-yellow-200',
						},
						{ name: '스', status: '', avatar: 'bg-red-500' },
					].map((friend) => (
						<div
							key={friend.name}
							className='flex items-center justify-between rounded-lg bg-white p-3 shadow-sm'
						>
							<div className='flex items-center'>
								<div
									className={`mr-3 h-10 w-10 rounded-full ${friend.avatar}`}
								></div>
								<div>
									<p className='font-medium'>{friend.name}</p>
									{friend.status && (
										<p className='text-xs text-gray-500'>{friend.status}</p>
									)}
								</div>
							</div>
							<button className='rounded-full bg-gray-700 px-3 py-1 text-xs text-white'>
								코디 요청
							</button>
						</div>
					))}
				</div>
			</div>

			<div className='absolute bottom-0 flex w-[320px] justify-around border-t border-gray-200 bg-white py-3'>
				<button className='flex flex-col items-center'>
					<div className='mb-1 h-6 w-6 text-gray-800'>👥</div>
					<span className='text-xs'>FRIENDS</span>
				</button>
				<button className='relative -mt-5 flex flex-col items-center'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-800'>
						<Plus className='h-6 w-6 text-white' />
					</div>
				</button>
				<button className='flex flex-col items-center'>
					<div className='mb-1 h-6 w-6 text-gray-400'>👕</div>
					<span className='text-xs'>CLOSET</span>
				</button>
			</div>
		</div>
	</div>
);

export default FriendRequest;
