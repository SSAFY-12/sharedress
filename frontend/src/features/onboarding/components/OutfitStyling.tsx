import { ChevronLeft } from 'lucide-react';
import tshirts from '@/assets/onboarding/gptTshirts-removebg-preview.png';
import hair from '@/assets/onboarding/gpthair.png';
import hoodi from '@/assets/onboarding/gpthoodi.png';
import outer from '@/assets/onboarding/gptouter-removebg-preview.png';
import pants from '@/assets/onboarding/gptpants.png';
import shortPants from '@/assets/onboarding/gptshortpants-removebg-preview.png';

const OutfitStyling = () => (
	<div className='w-full max-w-md'>
		<div className='relative h-[500px] w-[320px] overflow-hidden rounded-xl bg-white shadow-md'>
			<div className='border-b border-gray-100 p-4'>
				<div className='flex items-center'>
					<ChevronLeft className='h-5 w-5 text-gray-500' />
					<span className='ml-2 font-medium'>코디</span>
				</div>
			</div>

			<div className='p-4'>
				<div className='mb-4 flex h-48 items-center justify-center bg-gray-50 p-3'>
					<div className='flex items-center space-x-4'>
						<div className='flex h-28 w-20 items-center justify-center'>
							<img
								src={tshirts}
								alt='상의'
								className='h-28 w-20 object-contain'
							/>
						</div>
						<div className='flex h-28 w-20 items-center justify-center'>
							<img
								src={shortPants}
								alt='반바지'
								className='h-28 w-20 object-contain'
							/>
						</div>
						<div className='flex h-28 w-20 items-center justify-center'>
							<img
								src={outer}
								alt='아우터'
								className='h-28 w-20 object-contain'
							/>
						</div>
					</div>
				</div>

				<div className='mb-3 flex border-b border-gray-200'>
					<button className='flex-1 border-b-2 border-gray-800 py-2 text-sm font-medium whitespace-nowrap min-w-[48px]'>
						전체
					</button>
					<button className='flex-1 py-2 text-sm text-gray-400 whitespace-nowrap min-w-[48px]'>
						아우터
					</button>
					<button className='flex-1 py-2 text-sm text-gray-400 whitespace-nowrap min-w-[48px]'>
						상의
					</button>
					<button className='flex-1 py-2 text-sm text-gray-400 whitespace-nowrap min-w-[48px]'>
						하의
					</button>
					<button className='flex-1 py-2 text-sm text-gray-400 whitespace-nowrap min-w-[48px]'>
						신발
					</button>
					<button className='flex-1 py-2 text-sm text-gray-400 whitespace-nowrap min-w-[48px]'>
						기타
					</button>
				</div>

				<div className='grid grid-cols-3 gap-2'>
					{[
						tshirts,
						pants,
						hoodi,
						outer,
						shortPants,
						hair,
						tshirts,
						pants,
						hoodi,
					].map((img, idx) => {
						const altArr = [
							'면티',
							'바지',
							'후드티',
							'아우터',
							'반바지',
							'비니',
							'면티',
							'바지',
							'후드티',
						];
						return (
							<div key={idx} className='flex flex-col'>
								<div className='aspect-square overflow-hidden rounded-lg bg-gray-100'>
									<img
										src={img}
										alt={altArr[idx]}
										className='h-full w-full object-cover'
									/>
								</div>
								<div className='mt-1'>
									<p className='text-xs text-gray-500'>{altArr[idx]}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	</div>
);

export default OutfitStyling;
