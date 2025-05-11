import { useEffect } from 'react';
import { SubBtnModalProps } from './SubBtnModal.types';
import { useNavigate } from 'react-router-dom';

export const SubBtnModal = ({
	isOpen,
	onClose,
	className,
}: SubBtnModalProps) => {
	// isOpen prop이 변경될 때마다 showOptions 상태를 동기화
	// const [showOptions, setShowOptions] = useState(isOpen);
	// const [setShowOptions] = useState(isOpen);

	// isOpen prop이 변경될 때마다 showOptions 상태를 업데이트
	useEffect(() => {
		// setShowOptions(isOpen);
		// 모달이 열릴 때 body 스크롤 방지
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		}
		// 모달이 닫힐 때 body 스크롤 복원
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	// 모달이 보이지 않을 때는 아무것도 렌더링하지 않음
	if (!isOpen) return null;
	const navigate = useNavigate();

	return (
		<>
			{/* 배경 오버레이 */}
			<div
				className='fixed inset-0 bg-black bg-opacity-50 z-40'
				onClick={onClose}
			/>
			{/* 모달 컨테이너 */}
			<div
				className={`fixed bottom-[85px] left-0 right-0 z-50 ${className} flex justify-center items-center`}
			>
				<div className='flex flex-col justify-end items-center w-full px-14'>
					<div className='flex flex-col gap-2 w-full max-w-[350px]'>
						{/* 옷장 섹션 */}
						<div className='flex flex-col rounded-xl bg-white p-5 pb-6.5 gap-2.5'>
							<span className='w-full text-start text-smallButton text-low'>
								옷장
							</span>
							<button
								className='flex flex-row justify-start items-center gap-3.5 py-[4px] px-0'
								onClick={() => {
									console.log('옷 등록');
									onClose();
									navigate('/regist');
								}}
							>
								<img src='/icons/create_cloth_add.svg' alt='plus' />
								<span className='text-default text-regular'>옷등록</span>
							</button>
						</div>

						{/* 코디 섹션 */}
						<div className='flex flex-col rounded-xl bg-white p-5 pb-6.5 gap-2.5'>
							<span className='w-full text-start text-smallButton text-low'>
								코디
							</span>
							<div className='flex flex-col gap-1'>
								{/* 코디 만들기 버튼 */}
								<button
									className='flex flex-row justify-start items-center gap-3.5 py-[4px] px-0'
									onClick={() => {
										console.log('코디 만들기');
										onClose();
										navigate('/codi/edit');
									}}
								>
									<img src='/icons/create_codi_add.svg' alt='plus' />
									<span className='text-default text-regular'>코디 만들기</span>
								</button>
								{/* 친구 코디 요청 버튼 */}
								<button
									className='flex flex-row justify-start items-center gap-3.5 py-[4px] px-0'
									onClick={() => {
										console.log('옷 등록');
										onClose();
										navigate('/regist');
									}}
								>
									<img src='/icons/create_codi_request.svg' alt='plus' />
									<span className='text-default text-regular'>
										친구에게 코디 요청하기
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
