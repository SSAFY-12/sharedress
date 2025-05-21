import { ChevronLeft } from 'lucide-react';

const OutfitStyling = () => (
	<div className='w-full max-w-md'>
		<div className='relative h-[500px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='border-b border-gray-100 p-4'>
				<div className='flex items-center'>
					<ChevronLeft className='h-5 w-5 text-gray-500' />
					<span className='ml-2 font-medium'>코디</span>
				</div>
			</div>

			<div className='p-4'>
				<div className='mb-4 flex h-48 items-center justify-center bg-gray-50 p-3'>
					<div className='flex items-center space-x-4'>
						<div className='flex h-32 w-24 items-center justify-center'>
							<img
								src='https://via.placeholder.com/96x128?text=Top'
								alt='핑크 상의'
								className='h-full w-full object-contain'
							/>
						</div>
						<div className='flex h-32 w-24 items-center justify-center'>
							<img
								src='https://via.placeholder.com/96x128?text=Skirt'
								alt='검정 스커트'
								className='h-full w-full object-contain'
							/>
						</div>
						<div className='flex h-16 w-24 items-end justify-center'>
							<img
								src='https://via.placeholder.com/96x64?text=Shoes'
								alt='검정 신발'
								className='h-full w-full object-contain'
							/>
						</div>
					</div>
				</div>

				<div className='mb-3 flex border-b border-gray-200'>
					<button className='flex-1 border-b-2 border-gray-800 py-2 text-sm font-medium'>
						전체
					</button>
					<button className='flex-1 py-2 text-sm text-gray-400'>아우터</button>
					<button className='flex-1 py-2 text-sm text-gray-400'>상의</button>
					<button className='flex-1 py-2 text-sm text-gray-400'>하의</button>
					<button className='flex-1 py-2 text-sm text-gray-400'>신발</button>
					<button className='flex-1 py-2 text-sm text-gray-400'>기타</button>
				</div>

				<div className='grid grid-cols-3 gap-2'>
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
						<div key={item} className='flex flex-col'>
							<div className='aspect-square overflow-hidden rounded-lg bg-gray-100'>
								<img
									src={`https://via.placeholder.com/120?text=Item${item}`}
									alt={`의류 아이템 ${item}`}
									className='h-full w-full object-cover'
								/>
							</div>
							<div className='mt-1'>
								<p className='text-xs text-gray-500'>INTHERAW</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	</div>
);

export default OutfitStyling;
