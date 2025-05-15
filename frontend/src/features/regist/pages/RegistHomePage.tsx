import { router } from '@/routes';
import SelectRegistBlock from '@/features/regist/components/SelectRegistBlock';
import { useGetCloth } from '@/features/regist/hooks/useGetCloth';

const RegistHomePage = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: cloth } = useGetCloth();
	return (
		<div className='flex-1 w-full h-full flex flex-col justify-center items-center px-4 pb-36 gap-5'>
			<div className='flex w-full text-title font-bold justify-start px-2.5'>
				등록 방법 선택
			</div>
			<div className='flex flex-col w-full justify-center items-center gap-4'>
				<SelectRegistBlock
					title='구매내역 스캔'
					description='쇼핑몰 구매내역으로 한번에 등록'
					image='card.png'
					onClick={() => router.navigate('/regist/scan')}
				/>
				<SelectRegistBlock
					title='옷 검색하기'
					description='옷 이름으로 검색하여 등록'
					image='search.png'
					onClick={() => router.navigate('/regist/search')}
				/>
				<div className='flex items-center justify-between bg-background w-full rounded-lg px-6 relative'>
					<div className='absolute inset-0 bg-black/30 rounded-lg z-10 flex items-center justify-center'>
						<span className='text-white text-title w-full pr-4'>
							{' '}
							업데이트 예정{' '}
						</span>
					</div>
					<div className='flex flex-col items-start justify-center gap-1.6 py-5'>
						<div className='flex text-topHeader text-regular'>
							사진으로 등록
						</div>
						<div className='flex text-description text-low'>
							사진으로 직접 등록
						</div>
					</div>
					<img
						src='/images/regist/camera.png'
						alt='사진으로 등록'
						className=' h-full object-cover'
					/>
				</div>
			</div>
		</div>
	);
};
export default RegistHomePage;
