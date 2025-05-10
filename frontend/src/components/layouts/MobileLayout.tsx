import { useLocation, Outlet, matchPath } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import SocialHeader from './SocialHeader';
import { NavConfig } from '@/constants/navConfig';
import getHeaderProps from '@/utils/getHeaderProps';
import { useNavigate } from 'react-router-dom';

export const MobileLayout = () => {
	const location = useLocation();
	const isSocial = location.pathname.replace(/\/$/, '') === '/social';
	const isMyPage = location.pathname.replace(/\/$/, '') === '/mypage';
	const isClothEdit = matchPath('/cloth/:id/edit', location.pathname) !== null;
	const headerProps = getHeaderProps(location.pathname);
	const navigate = useNavigate();

	/* 네비게이션 바 표시 여부 결정	*/
	const firstDepth = '/' + location.pathname.split('/')[1];
	const showNav = NavConfig[firstDepth] === true;

	// 뒤로가기 함수
	const onBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	return (
		<div className='min-h-screen flex flex-col'>
			<header className='fixed top-0 left-0 right-0 bg-white z-10'>
				{isMyPage || isClothEdit ? null : isSocial ? (
					<SocialHeader />
				) : (
					<Header {...headerProps} onBackClick={onBackClick} />
				)}
			</header>
			<main
				className={`flex-1 ${isMyPage || isClothEdit ? '' : 'mt-16'} ${
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
