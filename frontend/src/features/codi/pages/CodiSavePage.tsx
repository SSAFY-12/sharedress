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
import { createPortal } from 'react-dom';

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
				title: '임시 제목',
				description,
				isTemplate: false,
				items: formattedItems,
				...(mode === 'my' ? { isPublic } : {}),
			};

			console.log('[DEBUG] payload:', payload);

			// (2) CodiCanvas DOM 찾기
			const container = document.getElementById('codi-canvas-capture');
			console.log('캡처용 container:', container);
			if (container) {
				console.log('container.id:', container.id);
				console.log('container.className:', container.className);
				console.log('container.clientWidth:', container.clientWidth);
				console.log('container.clientHeight:', container.clientHeight);
				console.log('container.outerHTML:', container.outerHTML);
			}
			if (!container) throw new Error('캡처용 캔버스를 찾을 수 없습니다.');

			// (3) 캡처 시점에만 고정 크기 부여 (모바일/웹 구분, 조상까지 적용)
			const isMobile = window.innerWidth < 640;
			const width = isMobile ? '320px' : '400px';
			const height = isMobile ? '352px' : '440px';

			// 캡처 시점에 CodiCanvas + 부모 + 조상까지 width/height 강제 지정
			const elementsToFix: {
				el: HTMLElement;
				originalWidth: string;
				originalHeight: string;
			}[] = [];
			let el: HTMLElement | null = container;
			for (let i = 0; i < 3; i++) {
				// 최대 3단계 조상까지
				if (!el) break;
				elementsToFix.push({
					el,
					originalWidth: el.style.width,
					originalHeight: el.style.height,
				});
				el = el.parentElement as HTMLElement | null;
			}

			// 스타일을 !important로 강제
			const codiCanvas = container;
			const originalClass = codiCanvas.className;
			codiCanvas.style.setProperty('width', width, 'important');
			codiCanvas.style.setProperty('height', height, 'important');
			elementsToFix.forEach(({ el }) => {
				el.style.setProperty('width', width, 'important');
				el.style.setProperty('height', height, 'important');
			});

			// 캡처 직전 실제 크기 로그
			console.log('캡처 직전', codiCanvas.clientWidth, codiCanvas.clientHeight);
			await new Promise((resolve, reject) => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						requestAnimationFrame(async () => {
							try {
								const base64 = await captureCanvasImageWithRetry(container, 2);

								// (4) base64 → File 변환
								const file = base64ToFile(base64, 'codi.png', 'image/png');

								// (5) 코디 정보 저장 (썸네일 제외)
								const saved = await saveCodi(payload);
								const coordinationId = saved.content.id;

								// (6) coordinationId와 썸네일 이미지 업로드
								await uploadCodiThumbnail(coordinationId, file);

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
								resolve(null);
							} catch (error) {
								reject(error);
							} finally {
								// (8) 캡처 후 원복
								codiCanvas.className = originalClass;
								codiCanvas.style.removeProperty('width');
								codiCanvas.style.removeProperty('height');
								elementsToFix.forEach(
									({ el, originalWidth, originalHeight }) => {
										if (typeof originalWidth === 'string')
											el.style.width = originalWidth;
										if (typeof originalHeight === 'string')
											el.style.height = originalHeight;
										el.style.removeProperty('width');
										el.style.removeProperty('height');
									},
								);
							}
						});
					});
				});
			});
		} catch (error) {
			console.error('코디 저장 실패:', error);
			toast.error('코디 저장 실패');
		} finally {
			setIsSubmitting(false);
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
		<>
			{createPortal(
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '400px',
						height: '440px',
						pointerEvents: 'none',
						opacity: 0,
						zIndex: 9999,
					}}
				>
					<CodiCanvas
						items={codiItems}
						isEditable={false}
						updateItem={EMPTY_FN}
						removeItem={EMPTY_FN}
						maxZIndex={0}
						setMaxZIndex={EMPTY_FN}
						id='codi-canvas-capture'
						width={400}
						height={440}
					/>
				</div>,
				document.body,
			)}
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
								{/* [코디 캔버스] - 기존 미리보기 */}
								<CodiCanvas
									items={codiItems}
									isEditable={false}
									updateItem={EMPTY_FN}
									removeItem={EMPTY_FN}
									maxZIndex={0}
									setMaxZIndex={EMPTY_FN}
									id='codi-canvas'
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
		</>
	);
};

export default CodiSavePage;
