import { useEffect } from 'react';
import { Shirt, CoinsIcon as Coat, MessageSquare } from 'lucide-react';
import { SubBtnModalProps } from './SubBtnModal.types';

export const SubBtnModal = ({ isOpen, onClose }: SubBtnModalProps) => {
	// isOpen prop이 변경될 때마다 showOptions 상태를 동기화
	// const [showOptions, setShowOptions] = useState(isOpen);
	// const [setShowOptions] = useState(isOpen);

	// isOpen prop이 변경될 때마다 showOptions 상태를 업데이트
	useEffect(() => {
		// setShowOptions(isOpen);
	}, [isOpen]);

	// 모달이 보이지 않을 때는 아무것도 렌더링하지 않음
	if (!isOpen) return null;

	return (
		// 모달의 기본 컨테이너
		<div className='relative flex flex-col items-center justify-center p-8'>
			<div className='absolute bottom-20 right-4 flex flex-col gap-2'>
				{/* 옷장 섹션 */}
				<div className='rounded-xl bg-white p-2 shadow-lg'>
					<div className='px-4 py-3 font-medium'>옷장</div>
					<button
						className='flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50'
						onClick={() => {
							console.log('옷 등록');
							onClose(); // 버튼 클릭 시 모달 닫기
						}}
					>
						<span className='flex h-6 w-6 items-center justify-center'>
							<Shirt className='h-5 w-5 text-green-500' />
						</span>
						<span>옷등록</span>
					</button>
				</div>

				{/* 코디 섹션 */}
				<div className='rounded-xl bg-white p-2 shadow-lg'>
					<div className='px-4 py-3 font-medium'>코디</div>
					{/* 코디 만들기 버튼 */}
					<button
						className='flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50'
						onClick={() => {
							console.log('코디 만들기');
							onClose();
						}}
					>
						<span className='flex h-6 w-6 items-center justify-center'>
							<Coat className='h-5 w-5 text-gray-400' />
						</span>
						<span>코디 만들기</span>
					</button>
					{/* 친구 코디 요청 버튼 */}
					<button
						className='flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50'
						onClick={() => {
							console.log('친구에게 코디 요청하기');
							onClose();
						}}
					>
						<span className='flex h-6 w-6 items-center justify-center'>
							<MessageSquare className='h-5 w-5 text-blue-400' />
						</span>
						<span>친구에게 코디 요청하기</span>
					</button>
				</div>
			</div>
		</div>
	);
};
