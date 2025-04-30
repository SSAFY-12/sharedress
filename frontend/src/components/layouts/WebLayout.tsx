import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';

export const WebLayout = () => (
	<div className='h-full flex flex-col'>
		<header className='sticky top-0 bg-white z-10'>
			<Header badgeType='success' badgeText='none' />
		</header>
		<main className='flex-1 overflow-y-auto'>
			<Outlet />
		</main>
		<footer className='sticky bottom-0 bg-white z-10'>
			<NavBar />
		</footer>
	</div>
);
