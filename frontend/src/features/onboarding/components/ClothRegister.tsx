import { ChevronLeft } from 'lucide-react';

const ClothesRegister = () => (
	<div className='w-full max-w-md'>
		<div className='h-[580px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='flex items-center p-4'>
				<ChevronLeft className='h-5 w-5 text-gray-500' />
				<span className='ml-2 font-medium'>옷 등록하기</span>
			</div>

			<div className='p-6 pt-0'>
				<h2 className='mb-6 text-xl font-bold'>등록 방법 선택</h2>

				<div className='space-y-4'>
					<div className='flex items-center rounded-xl bg-gray-50 p-4'>
						<div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
							<img
								src='https://via.placeholder.com/24'
								alt='카드'
								className='h-6 w-6'
							/>
						</div>
						<div>
							<p className='font-medium'>구매내역 스캔</p>
							<p className='text-sm text-gray-500'>
								쇼핑몰 구매내역으로 한번에 등록
							</p>
						</div>
						<img
							src='https://via.placeholder.com/60'
							alt='카드 이미지'
							className='ml-auto h-12 w-16 object-contain'
						/>
					</div>

					<div className='flex items-center rounded-xl bg-gray-50 p-4'>
						<div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
							<img
								src='https://via.placeholder.com/24'
								alt='돋보기'
								className='h-6 w-6'
							/>
						</div>
						<div>
							<p className='font-medium'>옷 검색하기</p>
							<p className='text-sm text-gray-500'>옷 이름으로 검색하여 등록</p>
						</div>
						<img
							src='https://via.placeholder.com/60'
							alt='돋보기 이미지'
							className='ml-auto h-12 w-16 object-contain'
						/>
					</div>

					<div className='flex items-center rounded-xl bg-gray-50 p-4'>
						<div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
							<img
								src='https://via.placeholder.com/24'
								alt='카메라'
								className='h-6 w-6'
							/>
						</div>
						<div>
							<p className='font-medium'>사진으로 등록</p>
							<p className='text-sm text-gray-500'>사진으로 직접 등록</p>
						</div>
						<img
							src='https://via.placeholder.com/60'
							alt='카메라 이미지'
							className='ml-auto h-12 w-16 object-contain'
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default ClothesRegister;
