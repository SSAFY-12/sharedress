import { ChevronLeft, Receipt, Search, Camera } from 'lucide-react';

const ClothesRegister = () => (
	<div className='w-full max-w-md'>
		<div className='h-[500px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='flex items-center p-4'>
				<ChevronLeft className='h-5 w-5 text-gray-500' />
				<span className='ml-2 font-medium text-left'>옷 등록하기</span>
			</div>

			<div className='p-6 pt-0'>
				<h2 className='mb-6 text-xl font-bold text-left'>등록 방법 선택</h2>

				<div className='space-y-4'>
					<div className='flex items-center rounded-xl bg-gray-50 p-4'>
						<div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
							<Receipt className='h-8 w-8 text-blue-600' />
						</div>
						<div className='text-left text-wrap'>
							<p className='font-medium'>구매내역 스캔</p>
							<p className='text-sm text-gray-500'>
								다양한 쇼핑몰 구매내역으로 한번에 등록
							</p>
						</div>
					</div>

					<div className='flex items-center rounded-xl bg-gray-50 p-4'>
						<div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
							<Search className='h-8 w-8 text-gray-600' />
						</div>
						<div className='text-left text-wrap'>
							<p className='font-medium'>옷 검색하기</p>
							<p className='text-sm text-gray-500'>옷 이름으로 검색하여 등록</p>
						</div>
					</div>

					<div className='flex items-center rounded-xl bg-gray-50 p-4'>
						<div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
							<Camera className='h-8 w-8 text-green-600' />
						</div>
						<div className='text-left text-wrap'>
							<p className='font-medium'>사진으로 등록</p>
							<p className='text-sm text-gray-500'>사진으로 직접 등록</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default ClothesRegister;
