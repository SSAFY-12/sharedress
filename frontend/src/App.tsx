import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { WebLayout } from '@/components/layouts/WebLayout';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import useFcmInitialization from '@/features/alert/hooks/useFcmInitialization';
import useFcmStore from '@/store/useFcmStore';
// import * as Sentry from '@sentry/react';

export const App = () => {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const [isLoading, setIsLoading] = useState(true);
	// useTokenValidation();
	// 공개 라우트 목록
	// const isPublicRoute =
	// 	location.pathname === '/auth' ||
	// 	location.pathname === '/auth/google/callback' ||
	// 	location.pathname === '/oauth/google/callback' ||
	// 	location.pathname.startsWith('/link/') ||
	// 	location.pathname.startsWith('/friend/');

	// // 공개 라우트가 아니면 토큰 검사
	// useEffect(() => {
	// 	if (!isPublicRoute) {
	// 		useTokenValidation();
	// 	}
	// }, [isPublicRoute]);

	useEffect(() => {
		console.log('FCM Token:', useFcmStore.getState().token);
	}, []);
	// 토큰 유효성 검사 Hook은 항상 최상위에서 호출

	// FCM 초기화
	useFcmInitialization();

	// 앱 시작 시 토큰 초기화
	useEffect(() => {
		const init = async () => {
			await initializeAuth();
			setIsLoading(false);
		};
		init();
	}, [initializeAuth]);

	// const handleManualError = () => {
	// 	try {
	// 		console.log('수동 에러 발생 시도');
	// 		const error = new Error('수동으로 발생시킨 에러');
	// 		console.error('에러 발생:', error);
	// 		Sentry.captureException(error);
	// 		console.log('Sentry에 에러 전송 완료');
	// 	} catch (error) {
	// 		console.error('에러 처리 중 오류 발생:', error);
	// 	}
	// };

	if (isLoading || !isInitialized) {
		return <div>Loading...</div>;
	}

	return (
		<>
			{/* Sentry 테스트 버튼 */}
			{/* <div className='fixed top-4 right-4 flex flex-col gap-2'> */}
			{/* 자동 에러 테스트 */}
			{/* <button
				onClick={() => {
					console.log('자동 에러 발생 시도');
					throw new Error('자동으로 발생시킨 에러!');
				}}
				className='bg-red-500 text-white px-4 py-2 rounded'
			>
				자동 에러 발생
			</button> */}

			{/* 수동 에러 테스트 */}
			{/* <button
				onClick={handleManualError}
				className='bg-blue-500 text-white px-4 py-2 rounded'
			>
				수동 에러 발생
			</button>
		</div> */}

			{/* 모바일 레이아웃 */}
			<div className='block sm:hidden min-h-screen bg-white'>
				<MobileLayout />
			</div>

			{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
			<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
				<div className='w-[560px] h-screen bg-white rounded-xl overflow-hidden shadow-xl'>
					<div className='relative h-full flex flex-col'>
						<WebLayout />
					</div>
				</div>
			</div>

			{/* Toastify 컨테이너 */}
			<ToastContainer
				position='top-right'
				autoClose={3000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
				theme='light'
			/>
		</>
	);
};

export default App;
