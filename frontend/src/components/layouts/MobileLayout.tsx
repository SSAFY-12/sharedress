import { useLocation, Outlet, matchPath } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import SocialHeader from './SocialHeader';
import { shouldShowNav } from '@/constants/navConfig';
import getHeaderProps from '@/utils/getHeaderProps';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SubBtnModal } from '@/components/modals/sub-btn-modal/SubBtnModal';
import { useTokenValidation } from '@/features/auth/hooks/useTokenValidation';

export const MobileLayout = () => {
	useTokenValidation();
	const location = useLocation();
	const navigate = useNavigate();
	// const isLibrary = location.pathname.replace(/\/$/, '') === '/regist/search';
	const isSocial = location.pathname.replace(/\/$/, '') === '/social';
	const isMyPage = location.pathname.replace(/\/$/, '') === '/mypage';
	const isClothEdit = matchPath('/cloth/:id/edit', location.pathname) !== null;
	const isFriendPage = matchPath('/friend/:id', location.pathname) !== null;
	const isCodiEdit = matchPath('/codi/edit', location.pathname) !== null;
	const isCodiSave = matchPath('/codi/save', location.pathname) !== null;
	const isClothDetail = matchPath('/cloth/:id', location.pathname) !== null;
	const isCodiDetail = matchPath('/codi/:id', location.pathname) !== null;
	const isCodiPublicEdit =
		matchPath('/codi/:id/edit', location.pathname) !== null;
	const headerProps = getHeaderProps(location.pathname);

	/* 네비게이션 바 표시 여부 결정	*/
	const showNav = shouldShowNav(location.pathname);

	/* 모달 표시 여부 결정	*/
	const [isModalOpen, setIsModalOpen] = useState(false);

	// 뒤로가기 함수
	const onBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	useEffect(() => {
		console.log(isModalOpen);
	}, [isModalOpen]);

	return (
		<>
			<div className='min-h-screen flex flex-col'>
				<header className='fixed top-0 left-0 right-0 bg-white z-10'>
					{isMyPage ||
					isClothEdit ||
					isCodiEdit ||
					isCodiSave ||
					isFriendPage ||
					isClothDetail ||
					isCodiDetail ||
					isCodiPublicEdit ? null : isSocial ? (
						<SocialHeader />
					) : (
						<Header {...headerProps} onBackClick={onBackClick} />
					)}
				</header>
				<main
					className={`flex-1 ${
						isMyPage ||
						isClothEdit ||
						isCodiEdit ||
						isCodiSave ||
						isFriendPage ||
						isClothDetail ||
						isCodiDetail ||
						isCodiPublicEdit
							? ''
							: 'mt-16'
					} ${
						showNav ? 'mb-16' : 'mb-0'
					} h-full flex flex-col overflow-y-auto `}
				>
					<Outlet />
				</main>
				{showNav && (
					<footer className='fixed bottom-0 left-0 right-0 bg-white z-20'>
						<NavBar openModal={() => setIsModalOpen(true)} />
					</footer>
				)}
				{isModalOpen && (
					<SubBtnModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>
				)}
			</div>
		</>
	);
};
