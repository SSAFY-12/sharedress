import { router } from '@/routes';
import SelectRegistBlock from '@/features/regist/components/SelectRegistBlock';
import { useGetCloth } from '@/features/regist/hooks/useGetCloth';
import Header from '@/components/layouts/Header';
import { useNavigate } from 'react-router-dom';

const RegistHomePage = () => {
	const navigate = useNavigate();
	const { data } = useGetCloth();
	console.log(data, 'data');

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
					<SelectRegistBlock
						title='사진으로 등록'
						description='사진으로 직접 등록'
						image='camera.png'
						onClick={() => router.navigate('/regist/camera/pre')}
					/>
				</div>
			</div>
		</div>
	);
};
export default RegistHomePage;
