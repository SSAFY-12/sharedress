import { router } from '@/routes';
import SelectRegistBlock from '@/features/regist/components/SelectRegistBlock';
import { useGetCloth } from '@/features/regist/hooks/useGetCloth';
import Header from '@/components/layouts/Header';
import { useNavigate } from 'react-router-dom';
import { useCameraStore } from '@/store/useCameraStore';
import { toast } from 'react-toastify';

const RegistHomePage = () => {
	const navigate = useNavigate();
	const { data } = useGetCloth();
	console.log(data, 'data');
	const cameraStatus = useCameraStore((state) => state.camera.isScan);

	const handleBack = () => {
		navigate('/mypage');
	};

	return (
		<div className='flex flex-col h-full flex-1'>
			<Header showBack={true} subtitle='옷 등록하기' onBackClick={handleBack} />
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
					<div
						className='flex items-center justify-between bg-background w-full rounded-lg px-6 cursor-pointer relative'
						onClick={() =>
							cameraStatus
								? toast.error('등록 중에는 신규 등록이 불가능합니다.')
								: router.navigate('/regist/camera/pre')
						}
					>
						{cameraStatus && (
							<div className='absolute inset-0 bg-modify/30 rounded-lg z-10 flex items-center justify-center'>
								<div className='flex items-center justify-center gap-2'>
									<img
										src='/icons/loading.svg'
										className='w-4 h-4'
										alt='스캔중'
									/>
									<span className='text-white text-button w-full pr-4'>
										등록 중
									</span>
								</div>
							</div>
						)}
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
							className='h-full object-cover'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default RegistHomePage;
