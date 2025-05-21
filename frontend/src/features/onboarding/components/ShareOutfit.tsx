import { X, Plus } from 'lucide-react';

const ShareOutfit = () => (
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
				<div className='w-80 rounded-xl bg-white p-5 shadow-lg'>
					<div className='flex justify-end'>
						<button>
							<X className='h-5 w-5 text-gray-400' />
						</button>
					</div>

					<div className='mb-4 flex justify-center'>
						<div className='flex items-center'>
							<img
								src='https://via.placeholder.com/40'
								alt='셔츠'
								className='h-12 w-10 object-contain'
							/>
							<img
								src='https://via.placeholder.com/40'
								alt='바지'
								className='h-12 w-10 object-contain'
							/>
						</div>
					</div>

					<div className='mb-2 text-center'>
						<p className='text-gray-500'>링크를 복사해서</p>
						<p className='font-medium text-blue-500'>코디추천을 요청해보세요</p>
					</div>

					<div className='mb-4 flex items-center justify-between'>
						<span className='text-sm'>프로필 공개</span>
						<label className='relative inline-flex cursor-pointer items-center'>
							<input type='checkbox' className='peer sr-only' defaultChecked />
							<div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-800 peer-checked:after:translate-x-full"></div>
						</label>
					</div>

					<div className='flex items-center rounded-md border border-gray-200 bg-gray-50 p-2'>
						<input
							type='text'
							value='sharedress.co.kr/Mgn2NExPOy'
							readOnly
							className='flex-1 bg-transparent text-sm outline-none'
						/>
						<button className='ml-2'>
							<svg
								width='16'
								height='16'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<rect
									x='9'
									y='9'
									width='13'
									height='13'
									rx='2'
									stroke='#333333'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5'
									stroke='#333333'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default ShareOutfit;
