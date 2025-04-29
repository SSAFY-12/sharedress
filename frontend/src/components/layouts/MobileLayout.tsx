import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import { headerConfig } from '@/constants/headerConfig';

export const MobileLayout = () => {
	const location = useLocation(); // 현재 경로 가져오기
	const headerProps = headerConfig[ // 현재 경로에 따른 헤더 설정
		location.pathname as keyof typeof headerConfig // 현재 경로를 헤더 설정에 매핑
	] || {
		showBack: false,
		subtitle: '',
		badgeType: 'info' as const,
		badgeText: '',
	};

	return (
		<div className='fixed inset-0 w-full h-screen bg-white'>
			<Header {...headerProps} />
			<main className='flex-1 overflow-y-auto'>
				<Outlet />
			</main>
			<NavBar />
		</div>
	);
};
