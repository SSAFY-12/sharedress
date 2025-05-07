import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import SocialHeader from './SocialHeader';
import { headerConfig } from '@/constants/headerConfig';

export const MobileLayout = () => {
	const location = useLocation();
	const isSocial = location.pathname.replace(/\/$/, '') === '/social';
	const headerProps = headerConfig[
		location.pathname as keyof typeof headerConfig
	] || {
		showBack: false,
		subtitle: '',
		badgeIcon: 'info',
		badgeText: '',
	};

	return (
		<div className='min-h-screen flex flex-col'>
			<header className='fixed top-0 left-0 right-0 bg-white z-10'>
				{isSocial ? <SocialHeader /> : <Header {...headerProps} />}
			</header>
			<main className='flex-1 mt-16 mb-16 overflow-y-auto'>
				<Outlet />
			</main>
			<footer className='fixed bottom-0 left-0 right-0 bg-white z-10'>
				<NavBar />
			</footer>
		</div>
	);
};
