import {
	ChevronLeft,
	ChevronRight,
	Search,
	ShoppingBag,
	Menu,
} from 'lucide-react';
import CategoryCard from '../kream/components/CategoryCard';

const KreamUI = () => (
	<div className='min-h-screen bg-white'>
		{/* Top utility navigation */}
		<div className='flex justify-end items-center bg-gray-50 text-xs px-4 py-1 space-x-4'>
			<a href='#' className='hover:underline'>
				고객센터
			</a>
			<a href='#' className='hover:underline'>
				마이페이지
			</a>
			<a href='#' className='hover:underline'>
				관심
			</a>
			<a href='#' className='hover:underline'>
				알림
			</a>
			<a href='#' className='hover:underline'>
				로그인
			</a>
		</div>

		{/* Main navigation */}
		<div className='container mx-auto px-4 py-4 flex justify-between items-center'>
			<div className='flex-1'>
				<a href='#' className='font-bold text-2xl tracking-tighter'>
					KREAM
				</a>
			</div>
			<div className='hidden md:flex items-center space-x-8'>
				<a href='#' className='font-medium'>
					HOME
				</a>
				<a href='#' className='font-medium'>
					STYLE
				</a>
				<a href='#' className='font-medium'>
					SHOP
				</a>
			</div>
			<div className='flex items-center space-x-4'>
				<button aria-label='검색'>
					<Search className='h-6 w-6' />
				</button>
				<button aria-label='장바구니'>
					<ShoppingBag className='h-6 w-6' />
				</button>
				<button aria-label='메뉴'>
					<Menu className='h-6 w-6' />
				</button>
			</div>
		</div>

		{/* Category navigation */}
		<div className='border-t border-b border-gray-200'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex space-x-6 overflow-x-auto scrollbar-hide text-sm'>
					<a href='#' className='whitespace-nowrap'>
						인기 신발
					</a>
					<a href='#' className='whitespace-nowrap font-medium'>
						주천
					</a>
					<a href='#' className='whitespace-nowrap flex items-center'>
						랭킹
						<span className='text-red-500 ml-0.5'>•</span>
					</a>
					<a href='#' className='whitespace-nowrap'>
						럭셔리
					</a>
					<a href='#' className='whitespace-nowrap'>
						남성
					</a>
					<a href='#' className='whitespace-nowrap'>
						여성
					</a>
					<a href='#' className='whitespace-nowrap'>
						발견
					</a>
					<a href='#' className='whitespace-nowrap'>
						이벤트
					</a>
				</div>
			</div>
		</div>

		{/* Hero banner - Changed to blue ocean theme */}
		<div className='relative bg-cyan-600 text-white'>
			<div className='absolute inset-0 flex items-center justify-between px-4 z-10'>
				<button aria-label='이전' className='bg-black/30 rounded-full p-2'>
					<ChevronLeft className='h-6 w-6' />
				</button>
				<button aria-label='다음' className='bg-black/30 rounded-full p-2'>
					<ChevronRight className='h-6 w-6' />
				</button>
			</div>

			{/* Blue gradient overlay to simulate ocean background */}
			<div className='absolute inset-0 bg-gradient-to-r from-cyan-700 to-cyan-500 opacity-70'></div>

			{/* Content */}
			<div className='container mx-auto px-4 py-32 relative z-0'>
				{/* Runners placeholder - just a gray box */}
				<div className='absolute inset-0 flex items-center justify-center'>
					<div className='w-full h-full bg-cyan-800/30'></div>
				</div>

				{/* Text content */}
				<div className='relative z-10 text-center mt-16'>
					<h2 className='text-4xl font-bold'>브라운아드 BALANCE</h2>
					<h3 className='text-2xl font-bold mt-4'>단독 발매 & 사은품</h3>
					<p className='mt-4'>브라운아드만의 고감도 캐주얼</p>
				</div>

				{/* Pagination dots */}
				<div className='flex justify-center mt-24 space-x-1 relative z-10'>
					{Array.from({ length: 50 }).map((_, i) => (
						<div
							key={i}
							className={`h-1.5 w-1.5 rounded-full ${
								i === 30 ? 'bg-white' : 'bg-white/40'
							}`}
						/>
					))}
				</div>
			</div>
		</div>

		{/* Product categories */}
		<div className='container mx-auto px-4 py-8'>
			<div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
				<CategoryCard title='신상' />
				<CategoryCard title='지금 인기' />
				<CategoryCard title='KREAM DRAW' isSpecial={true} />
				<CategoryCard title='정가 아래' />
				<CategoryCard title='트랙탑' />
			</div>
		</div>
	</div>
);

export default KreamUI;
