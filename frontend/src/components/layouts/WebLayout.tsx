import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import { headerConfig } from '@/constants/headerConfig';
import { NavConfig } from '@/constants/navConfig';

export const WebLayout = () => {
	const location = useLocation();
	const headerProps = headerConfig[
		location.pathname as keyof typeof headerConfig
	] || {
		showBack: false,
		subtitle: '',
		badgeType: 'info' as const,
		badgeText: '',
	};

	/* 네비게이션 바 표시 여부 결정	*/

	const firstDepth = '/' + location.pathname.split('/')[1];
	const showNav = NavConfig[firstDepth] === true;

	return (
		<div className='h-full flexW flex-col'>
			<header className='sticky top-0 bg-white z-10'>
				<Header {...headerProps} />
			</header>
			<main className='flex-1 h-full flex flex-col overflow-y-auto'>
				<Outlet />
			</main>
			{showNav && (
				<footer className='sticky bottom-0 bg-white z-10'>
					<NavBar />
				</footer>
			)}
		</div>
	);
};
