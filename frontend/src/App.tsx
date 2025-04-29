import './App.css';
import { WebLayout } from '@/components/layouts/WebLayout';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => (
	<>
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
			hideProgressBar={true}
			newestOnTop={false} // 새로운 토스트가 위에 표시
			closeOnClick
			rtl={false} // 오른쪽에서 왼쪽으로 표시
			pauseOnFocusLoss // 포커스 손실 시 일시정지
			draggable={false} // 드래그 가능 여부
			pauseOnHover // 마우스 오버 시 일시정지
			theme='light' // 테마 설정
		/>
	</>
);

export default App;
