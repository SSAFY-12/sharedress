import { Search, ShoppingBag, User, Heart, Lock } from 'lucide-react';

export default function App() {
	return (
		<div className='max-w-screen-2xl mx-auto px-6 font-sans'>
			{/* Top Navigation */}
			<div className='flex justify-between items-center py-4'>
				<div>
					<h1 className='text-2xl font-bold'>29CM</h1>
				</div>
				<div className='flex items-center space-x-6'>
					<a href='#' className='flex items-center text-xs'>
						<User className='w-4 h-4 mr-1' />
						MY PAGE
					</a>
					<a href='#' className='flex items-center text-xs'>
						<Heart className='w-4 h-4 mr-1' />
						MY LIKE
					</a>
					<a href='#' className='flex items-center text-xs'>
						<ShoppingBag className='w-4 h-4 mr-1' />
						SHOPPING BAG
					</a>
					<a href='#' className='flex items-center text-xs'>
						<Lock className='w-4 h-4 mr-1' />
						LOGIN
					</a>
				</div>
			</div>

			{/* Main Title */}
			<div className='flex justify-between items-center py-6'>
				<h2 className='text-4xl font-bold'>
					Special-Order Showcase PT 29Magazine
				</h2>
				<Search className='w-8 h-8' />
			</div>

			{/* Main Navigation */}
			<div className='border-b border-gray-200'>
				<nav className='flex space-x-6 py-4'>
					<a href='#' className='font-medium'>
						BEST
					</a>
					<a href='#' className='font-medium'>
						WOMEN
					</a>
					<a href='#' className='font-medium'>
						MEN
					</a>
					<a href='#' className='font-medium'>
						INTERIOR
					</a>
					<a href='#' className='font-medium'>
						KITCHEN
					</a>
					<a href='#' className='font-medium'>
						ELECTRONICS
					</a>
					<a href='#' className='font-medium'>
						DIGITAL
					</a>
					<a href='#' className='font-medium'>
						BEAUTY
					</a>
					<a href='#' className='font-medium'>
						FOOD
					</a>
					<a href='#' className='font-medium'>
						LEISURE
					</a>
					<a href='#' className='font-medium'>
						KIDS
					</a>
					<a href='#' className='font-medium'>
						CULTURE
					</a>
					<span className='mx-2 text-gray-300'>|</span>
					<a href='#' className='font-medium italic'>
						Event
					</a>
					<a href='#' className='font-medium'>
						Lookbook
					</a>
				</nav>
			</div>

			{/* Featured Content Grid */}
			<div className='grid grid-cols-3 gap-4 mt-4'>
				{/* First Banner */}
				<div className='relative h-[500px] overflow-hidden'>
					<img
						src='/placeholder.svg?height=500&width=400'
						alt='Man in dark shirt'
						className='w-full h-full object-cover'
					/>
					<div className='absolute bottom-20 left-10 text-white'>
						<p className='text-sm mb-2'>맨 신상품</p>
						<h3 className='text-4xl font-bold'>MAN NEW ARRIVAL</h3>
					</div>
				</div>

				{/* Second Banner */}
				<div className='relative h-[500px] overflow-hidden'>
					<img
						src='/placeholder.svg?height=500&width=400'
						alt='People in pink pajamas'
						className='w-full h-full object-cover'
					/>
					<div className='absolute bottom-20 left-10 text-white'>
						<p className='text-sm mb-2'>
							케이크 데코레이팅 9/9(금) 밤 10:00~9/12(월)
						</p>
						<h3 className='text-4xl font-bold'>월간이구옴</h3>
					</div>
				</div>

				{/* Third Banner */}
				<div className='relative h-[500px] overflow-hidden'>
					<img
						src='/placeholder.svg?height=500&width=400'
						alt='Person in white outfit'
						className='w-full h-full object-cover'
					/>
					<div className='absolute bottom-20 left-10 text-white'>
						<p className='text-sm mb-2'>던스트</p>
						<h3 className='text-4xl font-bold'>DUNST</h3>
					</div>
				</div>
			</div>
		</div>
	);
}
