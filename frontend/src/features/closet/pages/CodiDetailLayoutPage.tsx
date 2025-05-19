import { getMyLoginInfo } from '@/features/social/api/socialApi';
import { useLoginInfo } from '@/features/social/hooks/useLoginInfo';
import CodiDetailPage from './CodiDetailPage';

const CodiDetailLayoutPage = () => {
	useLoginInfo();
	// console.log('useLogin', useLogin);
	getMyLoginInfo();
	// console.log('data', data);

	return (
		<>
			{/* 모바일 레이아웃 */}
			<div className='block sm:hidden min-h-screen bg-white'>
				<CodiDetailPage />
			</div>

			{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
			<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
				<div className='w-[560px] h-screen bg-white rounded-xl overflow-hidden shadow-xl'>
					<div className='relative h-full flex flex-col'>
						<CodiDetailPage />
					</div>
				</div>
			</div>
		</>
	);
};

export default CodiDetailLayoutPage;
