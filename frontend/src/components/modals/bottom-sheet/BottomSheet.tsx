import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { BottomSheetProps } from '@/components/modals/bottom-sheet/BottomSheet.types';
import { CN } from '@/lib/utils';

// 메인 바텀 시트 컴포넌트
export const BottomSheet = ({
	isOpen, // 시트 표시 여부
	onClose, // 시트 닫기 함수
	children, // 시트 내부 컨텐츠
	className, // 추가 스타일
	snapPoints = [0.5, 1], // 기본값: 50%, 100% 위치에서 멈춤
	initialSnap = 0.5, // 기본값: 첫 번째 스냅 포인트
	showDragIndicator = true, // 기본값: 드래그 막대 표시
}: BottomSheetProps) => {
	// 시트의 DOM 요소 참조
	const sheetRef = useRef<HTMLDivElement>(null); //HTMLDivElement 타입 지정 -> <div> 요소를 Ts표현
	// 실제 요소의 높이를 측정하기 위한 상태

	// 현재 스냅 포인트 위치 상태
	const [currentSnap, setCurrentSnap] = useState(initialSnap); //바텀 시트의 현재 위치(snapPoints 배열의 인덱스)
	// 시트의 전체 높이 상태
	const [sheetHeight, setSheetHeight] = useState(0); // 시트의 높이를 저장하는 상태

	// 시트가 열릴 때마다 높이 계산
	useEffect(() => {
		if (isOpen && sheetRef.current) {
			setSheetHeight(sheetRef.current.scrollHeight); // 시트의 높이를 계산하여 상태에 저장
		}
	}, [isOpen, children]); //children이 변경될 때마다 실행 : 내부 컨텐츠 변경될 때 마다 높이를 다시 계산함

	// 드래그가 끝났을 때의 처리
	const handleDragEnd = (_: any, info: PanInfo) => {
		//실제 사용X -> _, 드래그 관련 정보
		// 이벤트 객체, 드래그 정보(Framer Motion에서 제공하는 타입)

		const threshold = 0.5; // 스와이프 동작을 결정하는 기준값 (현재 높이의 50%)
		const velocity = info.velocity.y; // 드래그 종료 시점의 Y축 속도 (픽셀/초)
		const direction = velocity > 0 ? 1 : -1; // 양수: 아래로, 음수: 위로
		const offset = info.offset.y; // 드래그한 총 거리 (픽셀)

		// 6. 빠른 스와이프 처리 -> velocity 기반
		if (Math.abs(velocity) > 500) {
			if (direction > 0) {
				// 아래로 스와이프
				if (currentSnap === 0) {
					onClose(); // 첫 번째 스냅 포인트(0.5)에서 아래로 스와이프하면 닫기
				} else {
					// 현재 높이가 1일 때
					setCurrentSnap(currentSnap - 1); // 이전 스냅 포인트로 이동 -> 50%로 이동
				}
			} else {
				// 위로 스와이프
				if (currentSnap < snapPoints.length - 1) {
					setCurrentSnap(currentSnap + 1); // 다음 스냅 포인트로 이동 -> 100%로 이동
				}
			}
			return;
		}

		// 천천히 드래그했을 때의 처리 -> offset 기반
		if (offset > sheetHeight * threshold) {
			//실제 px대비 드래그
			// 아래로 충분히 드래그
			if (currentSnap === 0) {
				onClose(); // 첫 번째 스냅 포인트면 닫기
			} else {
				setCurrentSnap(currentSnap - 1); // 이전 스냅 포인트로
			}
		} else if (offset < -sheetHeight * threshold) {
			// 위로 충분히 드래그
			if (currentSnap < snapPoints.length - 1) {
				setCurrentSnap(currentSnap + 1); // 다음 스냅 포인트로
			}
		}
	};

	return (
		// dom에서 제거될 때 애니메이션을 처리
		<AnimatePresence>
			{isOpen && (
				<>
					{/* 배경 오버레이: 반투명 검정 배경 */}
					<motion.div
						className='fixed inset-0 z-50 bg-black/25 backdrop-blur-sm'
						initial={{ opacity: 0 }} // 처음에는 투명
						animate={{ opacity: 1 }} // 나타날 때 불투명하게
						exit={{ opacity: 0 }} // 사라질 때 투명하게
						onClick={onClose} // 배경 클릭시 닫기
					/>

					{/* 바텀 시트 본체 */}
					<motion.div
						ref={sheetRef}
						className={CN(
							'fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md overflow-hidden rounded-t-2xl bg-white shadow-lg',
							className,
						)}
						initial={{ y: '100%' }} // 처음에는 화면 아래에
						animate={{
							// 현재 스냅 포인트 위치로 이동 -> 현재 스냅 포인트 위치(index)에 따라 애니메이션 처리
							y: snapPoints[currentSnap]
								? `calc(${(1 - snapPoints[currentSnap]) * 100}%)`
								: 0,
						}}
						exit={{ y: '100%' }} // 사라질 때 아래로
						transition={{ type: 'spring', damping: 25, stiffness: 300 }} // 스프링 효과
						drag='y' // y축 방향으로 드래그 가능
						dragConstraints={{ top: 0, bottom: 0 }} // 드래그 제한
						dragElastic={0.1} // 드래그 탄성
						onDragEnd={handleDragEnd} // 드래그 끝날 때 처리
					>
						{/* 드래그 표시 막대 */}
						{showDragIndicator && (
							<div className='flex w-full justify-center py-4'>
								<div className='h-1 w-12 rounded-full bg-gray-300' />
							</div>
						)}

						{/* 실제 내용물 */}
						<div className='max-h-[80vh] overflow-y-auto'>{children}</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
