import { Plus } from 'lucide-react';

const ActionMenu = () => (
	<div className='w-full max-w-md'>
		<div className='relative h-[580px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='p-4'>
				<div className='mb-4 rounded-xl bg-white p-4 shadow-sm'>
					<div className='flex items-center'>
						<div className='mr-3 h-16 w-16 rounded-full bg-purple-200'></div>
						<div>
							<p className='text-lg font-bold'>쉐어드레스#0522</p>
							<p className='text-sm text-gray-500'>
								옷장 공유와 조언을 한 번에🔥
							</p>
						</div>
					</div>
					<div className='mt-3 flex space-x-2'>
						<button className='flex-1 rounded-md bg-gray-100 py-2 text-sm'>
							프로필 편집
						</button>
						<button className='flex-1 rounded-md bg-gray-700 py-2 text-sm text-white'>
							내 옷장 공유
						</button>
					</div>
				</div>

				<div className='mb-4 flex border-b border-gray-200'>
					<button className='flex-1 border-b-2 border-gray-800 py-2 font-bold'>
						옷장
					</button>
					<button className='flex-1 py-2 text-gray-400'>코디</button>
				</div>

				<div className='mb-4 flex space-x-2 overflow-x-auto py-1 scrollbar-hide'>
					<button className='whitespace-nowrap rounded-full bg-gray-800 px-4 py-1.5 text-xs text-white'>
						전체
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs'>
						아우터
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs'>
						상의
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs'>
						바지
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs'>
						스커트
					</button>
				</div>

				<div className='grid grid-cols-3 gap-2'>
					{[1, 2, 3, 4, 5, 6].map((item) => (
						<div
							key={item}
							className='aspect-square overflow-hidden rounded-lg bg-gray-200'
						>
							{item === 1 && (
								<img
									src='https://via.placeholder.com/120'
									alt='바지'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 2 && (
								<img
									src='https://via.placeholder.com/120'
									alt='바지'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 3 && (
								<img
									src='https://via.placeholder.com/120'
									alt='후드티'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 4 && (
								<img
									src='https://via.placeholder.com/120'
									alt='티셔츠'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 5 && (
								<img
									src='https://via.placeholder.com/120'
									alt='모자'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 6 && (
								<img
									src='https://via.placeholder.com/120'
									alt='티셔츠'
									className='h-full w-full object-cover'
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<div className='absolute bottom-0 flex w-full justify-around border-t border-gray-200 bg-white py-3'>
				<button className='flex flex-col items-center'>
					<div className='mb-1 h-6 w-6 text-gray-400'>👥</div>
					<span className='text-xs'>FRIENDS</span>
				</button>
				<button className='relative -mt-5 flex flex-col items-center'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-800'>
						<Plus className='h-6 w-6 text-white' />
					</div>
				</button>
				<button className='flex flex-col items-center'>
					<div className='mb-1 h-6 w-6 text-gray-800'>👕</div>
					<span className='text-xs'>CLOSET</span>
				</button>
			</div>

			<div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
				<div className='w-72 rounded-xl bg-white shadow-lg'>
					<div className='border-b border-gray-100 p-4'>
						<p className='font-medium'>옷장</p>
						<button className='mt-2 flex items-center text-sm'>
							<span className='mr-2 text-green-500'>👕</span>
							옷등록
						</button>
					</div>
					<div className='p-4'>
						<p className='font-medium'>코디</p>
						<button className='mt-2 flex items-center text-sm'>
							<span className='mr-2 text-pink-500'>👗</span>
							코디 만들기
						</button>
						<button className='mt-2 flex items-center text-sm'>
							<span className='mr-2 text-blue-500'>💬</span>
							친구에게 코디 요청하기
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default ActionMenu;
