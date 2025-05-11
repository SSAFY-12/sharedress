import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const currentPath = location.pathname;
	const isFriendTabActive =
		currentPath === '/social' || currentPath.startsWith('/friend/');
	const isClosetTabActive = currentPath === '/mypage';
	console.log(isFriendTabActive, isClosetTabActive);

	return (
		<div
			className='flex items-end justify-between
     px-1.5 pb-2 h-[70px] bg-background z-99'
		>
			<div className='flex-1 flex justify-center items-center'>
				<button
					className='flex flex-col items-center justify-center gap-1.5 py-1'
					onClick={() => navigate('/social')}
				>
					<img
						src={
							isFriendTabActive
								? '/icons/nav_friend_selected.svg'
								: '/icons/nav_friend_default.svg'
						}
						alt='nav-friends'
					/>
					<span
						className={
							isFriendTabActive
								? 'text-navUnselected text-regualr'
								: 'text-navUnselected text-low'
						}
					>
						FRIENDS
					</span>
				</button>
			</div>
			<div className='flex justify-center items-center'>
				<button className='flex items-center justify-center p-4 bg-regular rounded-full border-8 border-background'>
					<img src='/icons/plus.svg' alt='nav-friends' />
				</button>
			</div>
			<div className='flex-1 flex justify-center items-center'>
				<button
					className='flex flex-col items-center justify-center gap-1.5 py-1'
					onClick={() => navigate('/mypage')}
				>
					<img
						src={
							isClosetTabActive
								? '/icons/nav_closet_selected.svg'
								: '/icons/nav_closet_default.svg'
						}
						alt='nav-friends'
					/>
					<span
						className={
							isClosetTabActive
								? 'text-navUnselected text-regualr'
								: 'text-navUnselected text-low'
						}
					>
						CLOSET
					</span>
				</button>
			</div>
		</div>
	);
};

export default NavBar;
