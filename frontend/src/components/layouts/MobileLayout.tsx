import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import SocialHeader from './SocialHeader';
import { headerConfig } from '@/constants/headerConfig';
import { NavConfig } from '@/constants/navConfig';

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

	/* 네비게이션 바 표시 여부 결정	*/

	const firstDepth = '/' + location.pathname.split('/')[1];
	const showNav = NavConfig[firstDepth] === true;

	return (
		<div className='min-h-screen flex flex-col'>
			<header className='fixed top-0 left-0 right-0 bg-white z-10'>
				{isSocial ? <SocialHeader /> : <Header {...headerProps} />}
			</header>
			<main
				className={`flex-1 mt-16 ${
					showNav ? 'mb-16' : 'mb-0'
				} h-full flex flex-col overflow-y-auto `}
			>
				<Outlet />
			</main>
			{showNav && (
				<footer className='fixed bottom-0 left-0 right-0 bg-white z-10'>
					<NavBar />
				</footer>
			)}
		</div>
	);
};
