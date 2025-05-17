import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
	myCodiSaveApi,
	recommendedCodiSaveApi,
	SaveCodiRequest,
	uploadCodiThumbnail,
} from '@/features/codi/api/codiApi';
import Header from '@/components/layouts/Header';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiSaveBottomSection from '@/features/codi/components/CodiSaveBottomSection';
import { base64ToFile } from '@/features/codi/utils/base64ToFile';
import { captureCanvasImageWithRetry } from '@/features/codi/utils/captureCanvasImageWithRetry';
import LoadingOverlay from '@/components/etc/LoadingOverlay';
import { toast } from 'react-toastify';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_FN = () => {};

// [코디 저장 페이지]
// - localStorage에서 코디 아이템을 불러와 캔버스에 렌더링
// - "완료"를 누르면 서버에 코디 정보 저장 → 썸네일 생성/업로드
// - 저장 성공 시 마이페이지(또는 친구 페이지)로 이동, 실패 시 에러 토스트
const CodiSavePage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// [1] 모드/타겟 멤버 정보 세팅 (추천/내 코디)
	// - mode: 'my'면 내 코디, 'recommended'면 친구 추천 코디
	// - targetMemberId: 추천 모드일 때 대상 멤버
	const mode = location.state?.mode ?? 'my';
	const targetMemberId = location.state?.targetMemberId ?? 0;

	// [2] 코디 저장 API 호출 함수 (썸네일 제외)
	// - myCodiSaveApi: 내 코디 저장
	// - recommendedCodiSaveApi: 친구 추천 코디 저장
	const saveCodi = async (
		payload: Omit<SaveCodiRequest, 'isPublic'> & { isPublic?: boolean },
	) => {
		if (mode === 'my') {
			return await myCodiSaveApi(payload as SaveCodiRequest);
			// 코디 정보(썸네일 제외)를 저장하고 coordinationId 반환
		}
		if (!targetMemberId) throw new Error('targetMemberId is required');
		return await recommendedCodiSaveApi(targetMemberId.toString(), payload);
	};

	// [3] 상태: 코디 아이템, 로딩, 설명, 공개여부, 제출중 여부
	const [codiItems, setCodiItems] = useState<any[]>([]); // 캔버스에 올려진 코디 아이템들
	const [isLoading, setIsLoading] = useState(true); // 로딩 상태
	const [description, setDescription] = useState(''); // 코디 설명
	const [isPublic, setIsPublic] = useState(true); // 공개 여부
	const [isSubmitting, setIsSubmitting] = useState(false); // 저장 중 여부

	// [4] 마운트 시 localStorage에서 코디 아이템 불러오기
	// - 저장 페이지 진입 시 localStorage의 codiItems를 불러와 캔버스에 렌더링
	useEffect(() => {
		const savedItems = localStorage.getItem('codiItems');
		if (savedItems) {
			setCodiItems(JSON.parse(savedItems));
		}
		setIsLoading(false);
	}, []);

	// [5] 뒤로가기 버튼 핸들러 (코디 수정 페이지로 이동)
	// - 저장 페이지에서 뒤로가기를 누르면 편집 페이지로 복귀
	const handleBackClick = () => {
		navigate('/codi/edit', {
			state: { ...location.state, from: 'save' },
		});
	};

	// [6] "완료" 버튼 클릭 시 저장 로직
	// - 코디 정보 저장 → 썸네일 생성/업로드 → 성공 시 페이지 이동
	const handleComplete = async () => {
		setIsSubmitting(true); // 저장 중 오버레이 표시
		try {
			// (1) 코디 아이템 포맷 변환 (서버 전송용)
			// - position, scale, rotation 등만 추림
			const formattedItems = codiItems.map((item) => ({
				id: Number(item.id),
				position: {
					x: item.position.x,
					y: item.position.y,
					z: item.zIndex,
				},
				scale: item.scale,
				rotation: item.rotation,
			}));

			const payload = {
				title: '임시 제목', // 실제 서비스에서는 제목 입력받을 수도 있음
				description, // 설명
				isTemplate: false, // 템플릿 여부(고정)
				items: formattedItems, // 코디 아이템 정보
				...(mode === 'my' ? { isPublic } : {}), // 내 코디면 공개여부 포함
			};

			console.log('[DEBUG] payload:', payload);

			// (2) CodiCanvas DOM 찾기
			// - 썸네일 생성을 위해 실제 DOM 요소를 찾음
			const container = document.getElementById('codi-canvas');
			// 캔버스 찾기 실패 시 예외
			if (!container) throw new Error('코디 캔버스를 찾을 수 없습니다.');

			// (3) CodiCanvas를 이미지로 캡처 (썸네일 생성)
			// - 내부적으로 렌더링/이미지 로딩 대기, html2canvas 등 활용
			const base64 = await captureCanvasImageWithRetry(container, 2);
			// 캔버스 이미지 캡처 => 내부적으로 시도하고, 실패하면 더 시도
			console.log('base64:', base64);

			// (4) base64 → File 변환
			const file = base64ToFile(base64, 'codi.png', 'image/png');
			console.log('[DEBUG] 변환된 File:', file);
			console.log('[DEBUG] 파일 크기:', file.size);

			// (5) 코디 정보 저장 (썸네일 제외)
			const saved = await saveCodi(payload);
			const coordinationId = saved.content.id;
			console.log('[DEBUG] 저장된 coordinationId:', coordinationId);

			// (6) coordinationId와 썸네일 이미지 업로드
			const result = await uploadCodiThumbnail(coordinationId, file);
			// 썸네일 업로드 응답 => coordinationId와 썸네일 이미지 업로드
			console.log('[DEBUG] 썸네일 업로드 응답:', result);

			// (7) 성공 토스트 및 페이지 이동
			toast.success('코디가 저장되었습니다', {
				icon: () => (
					<img
						src='/icons/toast_codi.svg'
						alt='icon'
						style={{ width: '20px', height: '20px' }}
					/>
				),
			});

			// 저장 성공 시 localStorage에서 임시 데이터 삭제 및 페이지 이동
			if (mode === 'my') {
				localStorage.removeItem('codiItems');
				navigate('/mypage', {
					state: { initialTab: '코디' },
				});
			} else {
				localStorage.removeItem('codiItems');
				navigate(`/friend/${targetMemberId}`, {
					state: { initialTab: '코디', initialSubTab: 'recommended' },
				});
			}
		} catch (error) {
			// 예외 발생 시 에러 토스트 및 콘솔 출력
			console.error('코디 저장 실패:', error);
			toast.error('코디 저장 실패');
		} finally {
			setIsSubmitting(false); // 저장 중 오버레이 해제
		}
	};

	// [7] 설명 입력 핸들러
	// - 설명 입력값을 상태에 반영
	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setDescription(e.target.value);
	};

	// [8] 공개여부 토글 핸들러
	// - 공개/비공개 상태 토글
	const handlePublicToggle = () => {
		setIsPublic(!isPublic);
	};

	// [헤더 props] - 상단 헤더에 전달
	const headerProps = {
		showBack: true, // 뒤로가기 버튼 표시
		badgeText: '완료', // 우측 버튼 텍스트
		onBackClick: handleBackClick, // 뒤로가기 핸들러
		onBadgeClick: handleComplete, // 저장(완료) 핸들러
	};

	// [렌더링 구조]
	// - 전체 화면: 상단 헤더, 중간(코디 캔버스), 하단(설명/공개여부 입력)
	return (
		<div className='w-full h-screen flex flex-col bg-white'>
			{/* 저장 중 오버레이 */}
			{isSubmitting && <LoadingOverlay message='코디 저장 중이에요...' />}
			{/* 상단 헤더 */}
			<Header {...headerProps} />
			<div className='flex-1 flex flex-col overflow-auto'>
				{isLoading ? (
					// 로딩 중 표시
					<div className='flex-1 flex items-center justify-center'>
						<p className='text-description'>로딩 중...</p>
					</div>
				) : (
					<>
						<div className='bg-gray-50'>
							{/* [코디 캔버스] - 코디 아이템 렌더링 (수정 불가, 미리보기 용) */}
							<CodiCanvas
								items={codiItems} // 캔버스에 올려진 아이템들
								isEditable={false} // 편집 불가(저장 전 미리보기)
								updateItem={EMPTY_FN} // 수정 불가
								removeItem={EMPTY_FN} // 삭제 불가
								maxZIndex={0}
								setMaxZIndex={EMPTY_FN}
							/>
						</div>
						{/* [하단 입력 영역] - 설명, 공개여부 등 입력 */}
						<CodiSaveBottomSection
							description={description}
							isPublic={isPublic}
							isLoading={isLoading}
							onDescriptionChange={handleDescriptionChange}
							onPublicToggle={handlePublicToggle}
							mode={mode}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default CodiSavePage;
