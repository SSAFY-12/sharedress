import { ChevronLeft, Search } from 'lucide-react';

const FriendRequest = () => (
	<div className='w-full max-w-md'>
		<div className='relative h-[500px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='border-b border-gray-100 p-4'>
				<div className='flex items-center'>
					<ChevronLeft className='h-5 w-5 text-gray-500' />
					<span className='ml-2 font-medium'>친구에게 코디 받기</span>
				</div>

				<div className='mt-3 rounded-md bg-gray-100 p-2'>
					<div className='flex items-center'>
						<Search className='mr-2 h-4 w-4 text-gray-400' />
						<input
							type='text'
							placeholder='검색'
							className='w-full bg-transparent text-sm outline-none'
						/>
					</div>
				</div>

				<button className='mt-3 w-full rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-500'>
					외부에 코디 추천 요청
				</button>
			</div>

			<div className='h-[calc(100%-140px)] overflow-y-auto p-2'>
				{[1, 2, 3, 4, 5, 6].map((item) => (
					<div
						key={item}
						className='mb-2 flex items-center justify-between rounded-lg p-2'
					>
						<div className='flex items-center'>
							<div className='relative mr-3 h-10 w-10 overflow-hidden rounded-full bg-purple-100'>
								<img
									src='https://via.placeholder.com/40'
									alt='프로필'
									className='h-full w-full object-cover'
								/>
								<div className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500'></div>
							</div>
							<div>
								<p className='text-sm font-medium'>예슬이기</p>
								<p className='text-xs text-gray-500'>나 백엔드인 친구하지</p>
							</div>
						</div>
						<button className='rounded-md bg-gray-800 px-3 py-1 text-xs text-white'>
							코디 요청
						</button>
					</div>
				))}
			</div>
		</div>
	</div>
);

export default FriendRequest;
