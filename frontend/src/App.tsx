import './App.css';
import { WebLayout } from '@/components/layouts/WebLayout';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Sentry from '@sentry/react';

export const App = () => {
	const handleManualError = () => {
		try {
			console.log('수동 에러 발생 시도');
			const error = new Error('수동으로 발생시킨 에러');
			console.error('에러 발생:', error);
			Sentry.captureException(error);
			console.log('Sentry에 에러 전송 완료');
		} catch (error) {
			console.error('에러 처리 중 오류 발생:', error);
		}
	};

	return (
		<>
			{/* Sentry 테스트 버튼 */}
			<div className='fixed top-4 right-4 flex flex-col gap-2'>
				{/* 자동 에러 테스트 */}
				<button
					onClick={() => {
						console.log('자동 에러 발생 시도');
						throw new Error('자동으로 발생시킨 에러!');
					}}
					className='bg-red-500 text-white px-4 py-2 rounded'
				>
					자동 에러 발생
				</button>

				{/* 수동 에러 테스트 */}
				<button
					onClick={handleManualError}
					className='bg-blue-500 text-white px-4 py-2 rounded'
				>
					수동 에러 발생
				</button>
			</div>

			{/* 모바일 레이아웃 */}
			<div className='block sm:hidden min-h-screen bg-white'>
				<MobileLayout />
			</div>

			{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
			<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
				<div className='w-[390px] h-[844px] bg-white rounded-xl overflow-hidden shadow-xl'>
					<WebLayout />
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
