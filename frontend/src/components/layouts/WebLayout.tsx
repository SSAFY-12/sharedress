import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';

export const WebLayout = () => (
	<div className='w-[390px] h-[844px] max-w-full max-h-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200'>
		<Header badgeType='success' badgeText='none' />

		<main className='flex-1 overflow-y-auto'>
			<Outlet /> {/* 여기에 페이지 내용이 렌더링됨 */}
		</main>

		<NavBar />
	</div>
);
