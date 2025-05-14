import FriendClosetPage from '@/features/closet/pages/FriendClosetPage';
import { useLoginInfo } from '@/features/social/hooks/useLoginInfo';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const FriendClosetLayoutPage = () => {
	const useLogin = useLoginInfo();
	// const navigate = useNavigate();
	// const { setIsGuest } = useAuthStore();
	// const { id } = useParams();
	// const hasRedirectedRef = useRef(false);

	// useEffect(() => {
	// 	if (hasRedirectedRef.current) return;
	// 	if (!useLogin.loginInfo?.isGuest) {
	// 		setIsGuest(false);
	// 		navigate(`/friend/${id}`);
	// 	}
	// }, [useLogin.loginInfo, id, navigate, setIsGuest]);

	return (
		<>
			{/* 모바일 레이아웃 */}
			<div className='block sm:hidden min-h-screen bg-white'>
				<FriendClosetPage />
			</div>

			{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
			<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
				<div className='w-[560px] h-screen bg-white rounded-xl overflow-hidden shadow-xl'>
					<div className='relative h-full flex flex-col'>
						<FriendClosetPage />
					</div>
				</div>
			</div>
		</>
	);
};

export default FriendClosetLayoutPage;
