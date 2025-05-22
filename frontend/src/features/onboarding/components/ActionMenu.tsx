import { Plus } from 'lucide-react';

const ActionMenu = () => (
	<div className='w-full max-w-md'>
		<div className='relative h-[500px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='p-4'>
				<div className='mb-4 rounded-xl bg-white p-3 shadow-sm'>
					<div className='flex items-center'>
						<div className='mr-3 h-12 w-12 rounded-full bg-purple-200'></div>
						<div>
							<p className='font-bold'>쉐어드레스#0522</p>
							<p className='text-xs text-gray-500'>
								옷장 공유와 조언을 한 번에🔥
							</p>
						</div>
					</div>
					<div className='mt-2 flex space-x-2'>
						<button className='flex-1 rounded-md bg-gray-100 py-1.5 text-xs'>
							프로필 편집
						</button>
						<button className='flex-1 rounded-md bg-gray-700 py-1.5 text-xs text-white'>
							내 옷장 공유
						</button>
					</div>
				</div>

				<div className='mb-2 flex border-b border-gray-200'>
					<button className='flex-1 border-b-2 border-gray-800 py-2 font-bold'>
						옷장
					</button>
					<button className='flex-1 py-2 text-gray-400'>코디</button>
				</div>

				<div className='mb-2 flex space-x-2 overflow-x-auto py-1 scrollbar-hide'>
					<button className='whitespace-nowrap rounded-full bg-gray-800 px-3 py-1 text-xs text-white'>
						전체
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-3 py-1 text-xs'>
						아우터
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-3 py-1 text-xs'>
						상의
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-3 py-1 text-xs'>
						바지
					</button>
					<button className='whitespace-nowrap rounded-full border border-gray-300 bg-white px-3 py-1 text-xs'>
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

			<div className='absolute bottom-0 flex w-full justify-between px-1.5 pb-2 h-[70px] bg-background z-99'>
				<div className='flex-1 flex justify-center items-center'>
					<button className='flex flex-col items-center justify-center gap-1.5 py-1'>
						<div className='mb-1 text-3xl text-navUnselected text-low'>👥</div>
						<span className='text-navUnselected text-low'>FRIENDS</span>
					</button>
				</div>
				<div className='flex justify-center items-center'>
					<button className='flex items-center justify-center p-4 bg-regular rounded-full border-8 border-background'>
						<Plus className='h-5 w-5 text-white' />
					</button>
				</div>
				<div className='flex-1 flex justify-center items-center'>
					<button className='flex flex-col items-center justify-center gap-1.5 py-1'>
						<div className='mb-1 text-3xl text-navUnselected text-regular'>
							👕
						</div>
						<span className='text-navUnselected text-regular'>CLOSET</span>
					</button>
				</div>
			</div>

			<div className='absolute inset-0 bg-black bg-opacity-50 z-40 pointer-events-none' />
			<div className='absolute bottom-0 left-0 right-0 z-50 flex justify-center items-end pointer-events-none'>
				<div className='flex flex-col justify-end items-center w-full px-4 pb-4'>
					<div className='flex flex-col gap-2 w-full max-w-[300px]'>
						{/* 옷장 섹션 */}
						<div className='flex flex-col rounded-xl bg-white p-5 pb-6.5 gap-2.5'>
							<span className='w-full text-start text-smallButton text-low'>
								옷장
							</span>
							<button
								className='flex flex-row justify-start items-center gap-3.5 py-[4px] px-0 cursor-default'
								disabled
							>
								<span className='text-2xl mr-2 text-green-500'>👕</span>
								<span className='text-default text-regular'>옷등록</span>
							</button>
						</div>
						{/* 코디 섹션 */}
						<div className='flex flex-col rounded-xl bg-white p-5 pb-6.5 gap-2.5'>
							<span className='w-full text-start text-smallButton text-low'>
								코디
							</span>
							<div className='flex flex-col gap-1'>
								<button
									className='flex flex-row justify-start items-center gap-3.5 py-[4px] px-0 cursor-default'
									disabled
								>
									<span className='text-2xl mr-2 text-pink-500'>👗</span>
									<span className='text-default text-regular'>코디 만들기</span>
								</button>
								<button
									className='flex flex-row justify-start items-center gap-3.5 py-[4px] px-0 cursor-default'
									disabled
								>
									<span className='text-2xl mr-2 text-blue-500'>💬</span>
									<span className='text-default text-regular'>
										친구에게 코디 요청하기
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default ActionMenu;
