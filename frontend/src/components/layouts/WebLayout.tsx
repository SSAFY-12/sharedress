import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import { headerConfig } from '@/constants/headerConfig';
import SocialHeader from './SocialHeader';

export const WebLayout = () => {
	const location = useLocation();
	const isSocial = location.pathname.replace(/\/$/, '') === '/social';
	const headerProps = headerConfig[
		location.pathname as keyof typeof headerConfig
	] || {
		showBack: false,
		subtitle: '',
		badgeType: 'info' as const,
		badgeText: '',
	};

	return (
		<div className='relative h-full flex flex-col'>
			<header className='absolute top-0 left-0 right-0 bg-white z-10'>
				{isSocial ? <SocialHeader /> : <Header {...headerProps} />}
			</header>
			<main className='flex-1 mt-16 mb-16 overflow-y-auto'>
				<Outlet />
			</main>
			<footer className='absolute bottom-0 left-0 right-0 bg-white z-10'>
				<NavBar />
			</footer>
		</div>
	);
};
