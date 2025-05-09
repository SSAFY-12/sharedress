import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import SocialHeader from './SocialHeader';
import { NavConfig } from '@/constants/navConfig';
import getHeaderProps from '@/utils/getHeaderProps';

export const WebLayout = () => {
	const location = useLocation();
	const isSocial = location.pathname.replace(/\/$/, '') === '/social';
	const isMyPage = location.pathname.replace(/\/$/, '') === '/mypage';
	const headerProps = getHeaderProps(location.pathname);

	/* 네비게이션 바 표시 여부 결정	*/

	const firstDepth = '/' + location.pathname.split('/')[1];
	const showNav = NavConfig[firstDepth] === true;
	return (
		<div className='relative h-full flex flex-col'>
			<header className='absolute top-0 left-0 right-0 bg-white z-10'>
				{isMyPage ? null : isSocial ? (
					<SocialHeader />
				) : (
					<Header {...headerProps} />
				)}
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
