import { Plus } from 'lucide-react';
import tshirts from '@/assets/onboarding/gptTshirts.png';
import hair from '@/assets/onboarding/gpthair.png';
import hoodi from '@/assets/onboarding/gpthoodi.png';
import outer from '@/assets/onboarding/gptouter.png';
import pants from '@/assets/onboarding/gptpants.png';
import shortPants from '@/assets/onboarding/gptshortpants.png';

const MyCloset = () => (
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
									src={pants}
									alt='바지'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 2 && (
								<img
									src={hoodi}
									alt='후드티'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 3 && (
								<img
									src={tshirts}
									alt='면티'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 4 && (
								<img
									src={hair}
									alt='비니'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 5 && (
								<img
									src={shortPants}
									alt='반바지'
									className='h-full w-full object-cover'
								/>
							)}
							{item === 6 && (
								<img
									src={outer}
									alt='아우터'
									className='h-full w-full object-cover'
								/>
							)}
						</div>
					))}
				</div>
			</div>

			<div className='absolute bottom-0 flex w-full justify-around border-t border-gray-200 bg-white py-3'>
				<button className='flex flex-col items-center'>
					<div className='mb-1 h-5 w-5 text-gray-400'>👥</div>
					<span className='text-xs'>FRIENDS</span>
				</button>
				<button className='relative -mt-5 flex flex-col items-center'>
					<div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-800'>
						<Plus className='h-5 w-5 text-white' />
					</div>
				</button>
				<button className='flex flex-col items-center'>
					<div className='mb-1 h-5 w-5 text-gray-800'>👕</div>
					<span className='text-xs'>CLOSET</span>
				</button>
			</div>
		</div>
	</div>
);

export default MyCloset;
