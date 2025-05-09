import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { WebLayout } from '@/components/layouts/WebLayout';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { ToastContainer, toast } from 'react-toastify';
import { useTokenValidation } from './features/auth/hooks/useTokenValidation';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import {
	requestNotificationPermission,
	onMessageListener,
} from '@/utils/firebase';
// import * as Sentry from '@sentry/react';

export const App = () => {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	// const isInitialized = useAuthStore((state) => state.isInitialized);
	const [isLoading, setIsLoading] = useState(true);

	// 토큰 유효성 검사 Hook은 항상 최상위에서 호출
	useTokenValidation();

	// FCM 초기화
	useEffect(() => {
		const initializeFCM = async () => {
			try {
				// 현재 알림 권한 상태 확인
				const permission = await Notification.permission;

				if (permission === 'default') {
					// 권한이 아직 요청되지 않은 경우
					toast.info('알림을 받으시려면 알림 권한을 허용해주세요.', {
						onClick: async () => {
							const token = await requestNotificationPermission();
							if (token) {
								toast.success('알림 권한이 허용되었습니다!');
								console.log('FCM Token:', token);

								// 포그라운드 메시지 리스너 설정
								onMessageListener()
									.then((payload) => {
										console.log('포그라운드 메시지 수신:', payload);
									})
									.catch((err) => {
										console.error('메시지 수신 실패:', err);
									});
							}
						},
					});
				} else if (permission === 'granted') {
					// 이미 권한이 허용된 경우
					const token = await requestNotificationPermission();
					if (token) {
						console.log('FCM Token:', token);

						// 포그라운드 메시지 리스너 설정
						onMessageListener()
							.then((payload) => {
								console.log('포그라운드 메시지 수신:', payload);
							})
							.catch((err) => {
								console.error('메시지 수신 실패:', err);
							});
					}
				} else {
					// 권한이 거부된 경우
					toast.warning(
						'알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요.',
						{
							onClick: () => {
								// 브라우저 설정 페이지로 이동하는 방법은 브라우저마다 다름
								window.open(
									'chrome://settings/content/notifications',
									'_blank',
								);
							},
						},
					);
				}
			} catch (error) {
				console.error('FCM 초기화 실패:', error);
				toast.error('알림 설정 중 오류가 발생했습니다.');
			}
		};

		initializeFCM();
	}, []);

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

	if (isLoading) {
		return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
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
				hideProgressBar={true} // 새로운 토스트가 위에 표시
				newestOnTop={false}
				closeOnClick
				rtl={false} // 오른쪽에서 왼쪽으로 표시
				pauseOnFocusLoss // 포커스 손실 시 일시정지
				draggable={false} // 드래그 가능 여부
				pauseOnHover // 마우스 오버 시 일시정지
				theme='light' // 테마 설정
			/>
		</>
	);
};

export default App;
