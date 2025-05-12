export const CarouselBanner = () => (
	<div className='relative overflow-hidden'>
		<div className='flex'>
			{/* First Banner - Purple Beauty Products */}
			<div className='w-full flex-shrink-0 relative'>
				<div className='bg-purple-800 h-96 flex items-center justify-center'>
					<div className='text-white p-8 max-w-md'>
						<div className='flex justify-center'>
							<img
								src='/placeholder.svg?height=300&width=300'
								alt='Beauty Products'
								className='h-64 object-contain'
							/>
						</div>
						<h2 className='text-2xl font-bold mt-4'>비 오는 날에도</h2>
						<h2 className='text-2xl font-bold'>찰랑이는 머릿결</h2>
						<p className='mt-2 text-sm'>미장센</p>
					</div>
				</div>
			</div>

			{/* Second Banner - Beauty Model */}
			<div className='w-full flex-shrink-0 relative'>
				<div className='bg-white h-96 flex items-center justify-center'>
					<div className='text-center'>
						<h2 className='text-4xl font-bold text-red-500'>
							오직 무신사 뷰티
						</h2>
						<div className='mt-4'>
							<img
								src='/placeholder.svg?height=300&width=200'
								alt='Beauty Model'
								className='h-64 mx-auto object-cover'
							/>
						</div>
						<p className='mt-2 text-sm text-gray-600'>
							무신사가 엄선한 스페셜 단독 뷰티
						</p>
					</div>
				</div>
			</div>

			{/* Third Banner - Promotion */}
			<div className='w-full flex-shrink-0 relative'>
				<div className='bg-pink-100 h-96 flex items-center justify-center'>
					<div className='text-center p-8 max-w-md'>
						<div className='flex justify-center'>
							<img
								src='/placeholder.svg?height=200&width=200'
								alt='Promotion'
								className='h-48 object-contain'
							/>
						</div>
						<h2 className='text-xl font-bold mt-4'>최대 1만원 적립금</h2>
						<h2 className='text-xl font-bold'>받을 수 있는 기회</h2>
						<button className='mt-4 px-4 py-2 bg-gray-200 rounded-md text-sm'>
							카테고리 찾아보기
						</button>
					</div>
				</div>
			</div>
		</div>

		{/* Carousel Indicators */}
		<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
			<div className='w-2 h-2 rounded-full bg-white opacity-50'></div>
			<div className='w-2 h-2 rounded-full bg-white'></div>
			<div className='w-2 h-2 rounded-full bg-white opacity-50'></div>
		</div>
	</div>
);
