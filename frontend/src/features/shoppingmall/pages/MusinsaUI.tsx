import FashionCarousel from '@/features/shoppingmall/musinsa/components/FashionCarousel';

const App = () => (
	<div className='min-h-screen bg-white'>
		{/* Main Navigation */}
		<header className='bg-black text-white'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between py-4'>
					<div className='flex items-center space-x-6'>
						<button className='text-white'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 12h16M4 18h16'
								/>
							</svg>
						</button>
						<span className='font-bold text-lg'>MUSINSA</span>
						<span>BEAUTY</span>
						<span>PLAYER</span>
						<span>OUTLET</span>
						<span>BOUTIQUE</span>
						<span>SHOES</span>
						<span>KIDS</span>
						<span className='text-gray-400'>(S)SNAP</span>
					</div>

					<div className='flex items-center space-x-4'>
						<span className='text-sm'>오프라인 스토어</span>
						<span className='text-sm'>검색</span>
						<span className='text-sm'>좋아요</span>
						<span className='text-sm'>마이</span>
						<span className='text-sm'>장바구니</span>
					</div>
				</div>
			</div>
		</header>

		{/* MUSINSA Logo */}
		<div className='bg-black text-white px-4 py-2 flex justify-between items-center'>
			<h1 className='text-xl font-bold'>MUSINSA</h1>
			<button>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
					/>
				</svg>
			</button>
		</div>

		{/* Search Bar */}
		<div className='px-4 py-2 bg-white border-b'>
			<div className='relative'>
				<input
					type='text'
					placeholder='키즈 서머 페스티벌 최대 80% 할인'
					className='w-full py-2 px-4 pr-10 rounded-md border border-gray-300 text-black'
				/>
				<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 text-gray-500'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
				</div>
			</div>
		</div>

		{/* Sub Navigation */}
		<div className='bg-black text-white px-4 py-2 overflow-x-auto'>
			<div className='flex space-x-6'>
				<span className='whitespace-nowrap text-sm'>추천</span>
				<span className='whitespace-nowrap text-sm'>랭킹</span>
				<span className='whitespace-nowrap text-sm'>세일</span>
				<span className='whitespace-nowrap text-sm'>브랜드</span>
				<span className='whitespace-nowrap text-sm'>발매</span>
				<span className='whitespace-nowrap text-sm'>여름 신상</span>
				<span className='whitespace-nowrap text-sm'>5월 신발장</span>
			</div>
		</div>

		{/* Fashion Carousel */}
		<FashionCarousel />
	</div>
);

export default App;
