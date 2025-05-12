import { Menu } from 'lucide-react';

export const MainNavigation = () => (
	<nav className='bg-black text-white px-4 py-3 flex items-center justify-between'>
		<div className='flex items-center space-x-4'>
			<Menu className='h-5 w-5' />
			<div className='flex items-center space-x-6'>
				<span className='font-bold'>MUSINSA</span>
				<span>BEAUTY</span>
				<span>PLAYER</span>
				<span>OUTLET</span>
				<span>BOUTIQUE</span>
				<span>SHOES</span>
				<span>KIDS</span>
				<span className='text-gray-400'>(S)SNAP</span>
			</div>
		</div>

		<div className='flex items-center space-x-4'>
			<span className='text-sm'>오프라인 스토어</span>
			<span className='text-sm'>검색</span>
			<span className='text-sm'>좋아요</span>
			<span className='text-sm'>마이</span>
			<span className='text-sm'>장바구니</span>
		</div>
	</nav>
);
