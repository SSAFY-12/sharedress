import './App.css';
import TestMobileLayout from './components/TestMobileLayout';

// import { Outlet } from 'react-router-dom';
// import { WebLayout } from '@/components/layouts/WebLayout';
// import { MobileLayout } from '@/components/layouts/MobileLayout';
// import { useIsMobile } from '@/hooks/useIsMobile';

// const App = () => {
// 	const isMobile = useIsMobile();
// 	const Layout = isMobile ? MobileLayout : WebLayout;

// 	return (
// 		<>
// 			{/* 웹: 모바일 화면 에뮬레이션 */}
// 			<div className='hidden sm:fixed sm:inset-0 sm:flex sm:justify-center sm:items-center sm:bg-neutral-900 sm:w-screen sm:h-screen'>
// 				<Layout>
// 					<Outlet /> {/* 여기에 현재 라우트의 페이지가 렌더링됨 */}
// 				</Layout>
// 			</div>

// 			{/* 모바일: 실제 모바일 화면 */}
// 			<div className='block sm:hidden fixed inset-0 w-full h-screen bg-white'>
// 				<Layout>
// 					<Outlet /> {/* 여기에 현재 라우트의 페이지가 렌더링됨 */}
// 				</Layout>
// 			</div>
// 		</>
// 	);
// };

const App = () => (
	<>
		{/* PC/태블릿: 중앙 프레임 */}
		<div className='hidden sm:fixed sm:inset-0 sm:flex sm:justify-center sm:items-center sm:bg-neutral-900 sm:w-screen sm:h-screen'>
			<div className='w-[390px] h-[844px] max-w-full max-h-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200'>
				<TestMobileLayout />
			</div>
		</div>
		{/* 모바일: 프레임 없이 전체, 오직 한 겹의 흰 배경만 */}
		<div className='block sm:hidden fixed inset-0 w-full h-screen bg-white'>
			<TestMobileLayout />
		</div>
	</>
);

export default App;
