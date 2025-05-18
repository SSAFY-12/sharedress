import React from 'react';
import { router } from '@/routes';
import SelectRegistBlock from '@/features/regist/components/SelectRegistBlock';
import { useGetCloth } from '@/features/regist/hooks/useGetCloth';
import { useRef } from 'react';
import { usePhotoClothStore } from '@/features/regist/stores/usePhotoClothStore';

const RegistHomePage = () => {
	const { data } = useGetCloth();
	console.log(data, 'data');
	const fileInputRef = useRef<HTMLInputElement>(null);

	// 파일 선택 이벤트
	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files) return;

		const fileList = Array.from(files).slice(0, 5);
		usePhotoClothStore.getState().setItems(fileList);

		router.navigate('/regist/camera');
	};

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
				<SelectRegistBlock
					title='사진으로 등록'
					description='사진으로 직접 등록'
					image='camera.png'
					onClick={() => fileInputRef.current?.click()}
				/>
				{/* 갤러리 여는 것을 위한 숨겨진 input */}
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					multiple={true}
					className='hidden'
					onChange={handleImageSelect}
				/>
				{/* <div className='flex items-center justify-between bg-background w-full rounded-lg px-6 relative'>
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
				</div> */}
			</div>
		</div>
	);
};
export default RegistHomePage;
