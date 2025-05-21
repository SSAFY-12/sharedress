import { ChevronLeft, Search } from 'lucide-react';

const FriendRequest = () => {
	const friends = [
		{
			id: 'dev',
			name: '쉐어드레스 개발자',
			desc: '개발자 코디룩',
			img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=facearea&w=400&h=400&q=80',
		},
		{
			id: 'beginner',
			name: '쉐어드레스 입문자',
			desc: '어플 쓰는법 알려줘',
			img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80',
		},
		{
			id: 'ai',
			name: '쉐어드레스 ai',
			desc: 'ai 열심히 했어요',
			img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80',
		},
		{
			id: 'frontend',
			name: '쉐어드레스 프론트',
			desc: '프론트도 열심히 했어요',
			img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
		},
		{
			id: 'backend',
			name: '쉐어드레스 백엔드',
			desc: '백엔드도 열심히했어요',
			img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
		},
	];

	return (
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
					{friends.map((friend) => (
						<div
							key={friend.id}
							className='mb-2 flex items-center justify-between rounded-lg p-2'
						>
							<div className='flex items-center'>
								<div className='relative mr-3 h-10 w-10 overflow-hidden rounded-full bg-purple-100'>
									<img
										src={friend.img}
										alt='프로필'
										className='h-full w-full object-cover'
									/>
									<div className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500'></div>
								</div>
								<div className='text-left'>
									<p className='text-sm font-medium'>{friend.name}</p>
									<p className='text-xs text-gray-500'>{friend.desc}</p>
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
};

export default FriendRequest;
