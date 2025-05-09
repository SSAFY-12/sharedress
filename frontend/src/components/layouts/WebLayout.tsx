import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import { headerConfig } from '@/constants/headerConfig';
import SocialHeader from './SocialHeader';
import { NavConfig } from '@/constants/navConfig';

export const WebLayout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isSocial = location.pathname.replace(/\/$/, '') === '/social';
	const headerProps = headerConfig[
		location.pathname as keyof typeof headerConfig
	] || {
		showBack: false,
		subtitle: '',
		badgeType: 'info' as const,
		badgeText: '',
	};

	// 뒤로가기 핸들러 추가
	const handleBackClick = () => {
		if (
			location.pathname === '/social/add' ||
			location.pathname === '/social/request'
		) {
			navigate('/social');
		}
	};

	/* 네비게이션 바 표시 여부 결정	*/
	const firstDepth = '/' + location.pathname.split('/')[1];
	const showNav = NavConfig[firstDepth] === true;
	return (
		<div className='relative min-h-screen flex flex-col'>
			<header className='absolute top-0 left-0 right-0 bg-white z-10'>
				{isSocial ? (
					<SocialHeader
						onProfileClick={() => navigate('/social/add')}
						onAddClick={() => navigate('/social/request')}
					/>
				) : (
					<Header {...headerProps} onBackClick={handleBackClick} />
				)}
			</header>

			<main className='flex-1 h-full flex flex-col overflow-y-auto mt-16'>
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
