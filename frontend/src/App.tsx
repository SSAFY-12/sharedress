import './App.css';
import { WebLayout } from '@/components/layouts/WebLayout';
import { MobileLayout } from '@/components/layouts/MobileLayout';

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
	</>
);

export default App;
