import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';

export const MobileLayout = () => (
	<div className='fixed inset-0 w-full h-screen bg-white'>
		<Header badgeType='success' badgeText='none' />
		<main className='flex-1 overflow-y-auto'>
			<Outlet /> {/* 여기에 페이지 내용이 렌더링됨 */}
		</main>
		<NavBar />
	</div>
);
