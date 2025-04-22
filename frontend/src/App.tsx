// import { useState } from 'react';
import { useEffect, useState } from 'react';
import './App.css';

export const App = () => {
	// 반응형 test
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth); //현재 width
		};

		window.addEventListener('resize', handleResize); //window자체 eventlistener -> resize 추가
		return () => window.removeEventListener('resize', handleResize); //추후 제거
	}, []);

	const getResponsiveColor = () => {
		if (windowWidth < 640) return 'text-red-500'; // sm 미만
		if (windowWidth < 768) return 'text-yellow-500'; // sm 이상, md 미만
		if (windowWidth < 1024) return 'text-green-500'; // md 이상, lg 미만
		if (windowWidth < 1280) return 'text-blue-500'; // lg 이상, xl 미만
		return 'text-purple-500'; // xl 이상
	};

	return (
		<div className='min-h-screen w-full'>
			{/* sm : 640px, md : 768px(태블릿), lg:1024px(작은 데스크탑), xl:1280px, 2xl:1536px */}
			<main className='px-4 md:px-8 lg:px-12 mx-auto max-w-screen-xl'>
				{/* 컨텐츠 */}
				<h1 className='text-2xl font-bold mb-4'>반응형 테스트</h1>
				<div className='p-4 bg-white rounded shadow mb-6'>
					<p className='text-lg mb-2'>
						현재 화면 너비:{' '}
						<span className='font-semibold'>{windowWidth}px</span>
					</p>
					<p className='mb-2'>
						현재 브레이크포인트:
						<span className={`font-bold ml-2 ${getResponsiveColor()}`}>
							{windowWidth < 640
								? 'default (<640px)'
								: windowWidth < 768
								? 'sm (≥640px)'
								: windowWidth < 1024
								? 'md (≥768px)'
								: windowWidth < 1280
								? 'lg (≥1024px)'
								: 'xl (≥1280px)'}
						</span>
					</p>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					<div className='bg-white p-4 rounded shadow'>
						<h2 className='font-bold mb-2'>모바일에서 1열</h2>
						<p>화면이 작을 때는 한 줄로 표시됩니다.</p>
					</div>
					<div className='bg-white p-4 rounded shadow'>
						<h2 className='font-bold mb-2'>태블릿에서 2열</h2>
						<p>md 크기(768px 이상)에서는 2열로 표시됩니다.</p>
					</div>
					<div className='bg-white p-4 rounded shadow'>
						<h2 className='font-bold mb-2'>데스크톱에서 3열</h2>
						<p>lg 크기(1024px 이상)에서는 3열로 표시됩니다.</p>
					</div>
				</div>
				<div className='mt-6 p-4 bg-white rounded shadow'>
					<p className='hidden sm:block md:hidden'>
						sm 화면에서만 보입니다 (640px-767px)
					</p>
					<p className='hidden md:block lg:hidden'>
						md 화면에서만 보입니다 (768px-1023px)
					</p>
					<p className='hidden lg:block xl:hidden'>
						lg 화면에서만 보입니다 (1024px-1279px)
					</p>
					<p className='hidden xl:block'>
						xl 화면에서만 보입니다 (1280px 이상)
					</p>
					<p className='block sm:hidden'>
						기본 화면에서만 보입니다 (640px 미만)
					</p>
				</div>
			</main>
		</div>
	);
};

export default App;
