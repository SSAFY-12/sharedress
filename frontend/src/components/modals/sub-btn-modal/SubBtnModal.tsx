import { useState } from 'react';
import { Shirt, CoinsIcon as Coat, MessageSquare } from 'lucide-react';

export const SubBtnModal = () => {
	// const [showOptions, setShowOptions] = useState(false);
	const [showOptions] = useState(false);

	return (
		<div className='relative flex flex-col items-center justify-center p-8'>
			{showOptions && (
				<div className='absolute bottom-20 right-4 flex flex-col gap-2'>
					{/* 첫 번째 모달 - 옷장 */}
					<div className='rounded-xl bg-white p-2 shadow-lg'>
						<div className='px-4 py-3 font-medium'>옷장</div>
						<button
							className='flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50'
							// 추후 onClick 이벤트 추가
							onClick={() => console.log('옷 등록')}
						>
							<span className='flex h-6 w-6 items-center justify-center'>
								<Shirt className='h-5 w-5 text-green-500' />
							</span>
							<span>옷등록</span>
						</button>
					</div>

					{/* 두 번째 모달 - 코디 */}
					<div className='rounded-xl bg-white p-2 shadow-lg'>
						<div className='px-4 py-3 font-medium'>코디</div>
						<button
							className='flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50'
							// 추후 onClick 이벤트 추가
							onClick={() => console.log('코디 만들기')}
						>
							<span className='flex h-6 w-6 items-center justify-center'>
								<Coat className='h-5 w-5 text-gray-400' />
							</span>
							<span>코디 만들기</span>
						</button>
						<button
							className='flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50'
							// 추후 onClick 이벤트 추가
							onClick={() => console.log('친구에게 코디 요청하기')}
						>
							<span className='flex h-6 w-6 items-center justify-center'>
								<MessageSquare className='h-5 w-5 text-blue-400' />
							</span>
							<span>친구에게 코디 요청하기</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
