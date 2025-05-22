import { ChevronLeft } from 'lucide-react';

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
					<div className='flex items-center justify-between bg-background w-full rounded-lg px-6 py-5 cursor-default'>
						<div className='flex flex-col items-start justify-center gap-1.5 text-left'>
							<div className='flex text-topHeader text-regular'>
								구매내역 스캔
							</div>
							<div className='flex text-description text-low'>
								다양한 쇼핑몰 구매내역으로 한번에 등록
							</div>
						</div>
						<img
							src='/images/regist/card.png'
							alt='구매내역 스캔'
							className='h-14 object-contain'
						/>
					</div>

					<div className='flex items-center justify-between bg-background w-full rounded-lg px-6 py-5 cursor-default'>
						<div className='flex flex-col items-start justify-center gap-1.5 text-left'>
							<div className='flex text-topHeader text-regular'>
								옷 검색하기
							</div>
							<div className='flex text-description text-low'>
								옷 이름으로 검색하여 등록
							</div>
						</div>
						<img
							src='/images/regist/search.png'
							alt='옷 검색하기'
							className='h-14 object-contain'
						/>
					</div>

					<div className='flex items-center justify-between bg-background w-full rounded-lg px-6 py-5 cursor-default'>
						<div className='flex flex-col items-start justify-center gap-1.5 text-left'>
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
							className='h-14 object-contain'
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default ClothesRegister;
