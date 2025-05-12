const FashionCarousel = () => (
	<div className='w-full flex'>
		{/* First Card - Checkered Shirt */}
		<div className='w-1/3 relative'>
			<div className='h-[500px] overflow-hidden'>
				<img
					src='/placeholder.svg?height=500&width=400'
					alt='Model in checkered shirt'
					className='w-full h-full object-cover'
				/>
			</div>
			<div className='absolute bottom-0 left-0 p-4 text-white'>
				<h3 className='text-xl font-medium'>유튜버 너드킹 픽</h3>
				<h3 className='text-xl font-medium'>반소매 셔츠</h3>
				<p className='mt-2 text-sm'>코포위</p>
			</div>
		</div>

		{/* Second Card - White COVENANT Shirt */}
		<div className='w-1/3 relative'>
			<div className='h-[500px] bg-pink-200 overflow-hidden'>
				<img
					src='/placeholder.svg?height=500&width=400'
					alt='Model in white COVENANT shirt'
					className='w-full h-full object-cover'
				/>
			</div>
			<div className='absolute bottom-0 left-0 p-4 text-white'>
				<h3 className='text-xl font-medium'>여름을 담은 그래픽</h3>
				<h3 className='text-xl font-medium'>발매 기념 할인</h3>
				<p className='mt-2 text-sm'>커버낫</p>
			</div>
		</div>

		{/* Third Card - Black and Red Sports Jacket */}
		<div className='w-1/3 relative'>
			<div className='h-[500px] bg-blue-100 overflow-hidden'>
				<img
					src='/placeholder.svg?height=500&width=400'
					alt='Model in black and red sports jacket'
					className='w-full h-full object-cover'
				/>
			</div>
			<div className='absolute bottom-0 left-0 p-4 text-white'>
				<h3 className='text-xl font-medium'>다가오는 여름의</h3>
				<h3 className='text-xl font-medium'>큐레이션</h3>
				<p className='mt-2 text-sm'>피지컬 에듀케이션 디파트먼트</p>
			</div>
		</div>
	</div>
);

export default FashionCarousel;
