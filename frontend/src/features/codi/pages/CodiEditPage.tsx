import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiEditBottomSection from '@/features/codi/components/CodiEditBottomSection';
import { useProfileStore } from '@/store/useProfileStore';
import { useCloset } from '@/features/closet/hooks/useCloset';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import CodiEditBottomAccordion from '@/features/codi/components/CodiEditBottomAccordion';
import { toast } from 'react-toastify';

// [코디 만들기/수정 페이지]
// - 사용자가 옷을 조합해서 코디를 만듦
// - "다음" 버튼을 누르면 localStorage에 코디 아이템 정보를 저장하고, 저장 페이지로 이동
// - 코디 아이템 추가/수정/삭제, 카테고리별 필터링, 모바일 UX 등 다양한 상태/이벤트 관리
// - 저장 페이지(CodiSavePage)에서 이후 실제 저장/썸네일 생성 로직이 이어짐

// [카테고리 목록] - 옷 종류별로 필터링에 사용
const CATEGORIES = [
	{ id: 'all', label: '전체' },
	{ id: '2', label: '아우터' },
	{ id: '1', label: '상의' },
	{ id: '3', label: '바지' },
	{ id: '6', label: '스커트' },
	{ id: '4', label: '신발' },
	{ id: '5', label: '기타' },
];

// 메인 컴포넌트: CodiEditPage
const CodiEditPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// [1] 모드/멤버 정보 세팅 (추천/내 코디)
	// - mode: 'my'면 내 코디, 'recommended'면 친구 추천 코디
	// - targetMemberId: 추천 모드일 때 대상 멤버
	const mode = location.state?.mode ?? 'my';
	const targetMemberId = location.state?.targetMemberId ?? 0;
	// - isWeb: 반응형 분기(웹/모바일)
	const isWeb = useMediaQuery('(min-width: 640px)');

	// - isRecommendedMode: 추천 모드 여부
	const isRecommendedMode = mode === 'recommended';
	// - memberId: 실제 옷장 조회에 사용할 멤버 ID
	const memberId = isRecommendedMode
		? targetMemberId
		: useProfileStore((state) => state.getMyId()) ?? 0;

	// [2] 카테고리 상태 관리
	// - activeCategory: 현재 선택된 카테고리 id ('all'이면 전체)
	// - categoryId: 실제 API에 넘길 숫자형 카테고리 id
	const [activeCategory, setActiveCategory] = useState('all');
	const categoryId =
		activeCategory === 'all' ? undefined : Number(activeCategory);

	// [3] 옷장 데이터 조회 (멤버, 카테고리 기준)
	// - useCloset: 옷장 아이템(페이지네이션) 불러옴
	const { data: products } = useCloset(memberId, categoryId);

	// [4] 코디에 올려진 아이템들 상태
	// - canvasItems: 현재 캔버스에 올려진 옷 아이템 배열
	// - maxZIndex: 가장 높은 z-index (레이어 순서)
	const [canvasItems, setCanvasItems] = useState<any[]>([]);
	const [maxZIndex, setMaxZIndex] = useState(0);

	// [5] 아이템을 캔버스에 추가하는 함수
	// - 옷 아이템을 캔버스에 올릴 때 호출
	// - zIndex, 위치, 회전, 스케일 등 초기값 부여
	// 레이어 쌓임 순서, 값이 클 수록 위에 잘보이기 때문(새로 추가되는 아이템이 가장 위에 보이게 되어야함)
	const addItemToCanvas = (item: any) => {
		// 현재 캔버스에 있는 아이템 중 가장 높은 z-index 계산
		const currentMaxZIndex =
			canvasItems.length > 0
				? Math.max(...canvasItems.map((item) => item.zIndex))
				: 0;
		const newZIndex = currentMaxZIndex + 1;
		const newItem = {
			...item, // 서버에서 받아온 아이템 원본 데이터 복사
			canvasId: `canvas-${item.id}-${Date.now()}`, // 캔버스에서 아이템 식별용 고유 ID
			// 캔버스에 추가될 아이템의 기본 위치/회전/스케일/zIndex 설정
			position: { x: 100, y: 100 }, // 기본 위치
			rotation: 0, // 기본 회전
			scale: 1, // 기본 스케일
			zIndex: newZIndex, // 가장 위에 쌓임
			imageUrl: item.imageUrl, // 이미지 URL
		};

		setMaxZIndex(newZIndex);
		setCanvasItems([...canvasItems, newItem]);
	};

	// [6] 캔버스 아이템 업데이트 함수 (위치/회전/스케일/zIndex 등 변경)
	// - 드래그/회전/스케일 등 조작 시 호출
	// 드래그, 회전, 크기 조절, 맨 앞으로 올리는 등의 동작
	const updateCanvasItem = (updatedItem: any) => {
		if (updatedItem.zIndex > maxZIndex) {
			// z-index관련 처리
			setMaxZIndex(updatedItem.zIndex);
		}
		setCanvasItems(
			canvasItems.map((item) =>
				// 캔버스에 있는 아이템 중 업데이트할 아이템 찾아서 업데이트
				item.canvasId === updatedItem.canvasId ? updatedItem : item,
			),
		);
	};

	// [7] 캔버스 아이템 제거 함수
	// - 캔버스에서 아이템을 삭제할 때 호출
	const removeFromCanvas = (canvasId: string) => {
		setCanvasItems(canvasItems.filter((item) => item.canvasId !== canvasId));
	};

	// [8] PWA 중복 인식 방지 설정 (모바일 UX 개선)
	// - viewport 고정, 더블탭 줌 방지 등 모바일 UX 최적화
	useEffect(() => {
		// 1. <meta name="viewport"> 태그를 찾아서
		const viewportMeta = document.querySelector('meta[name="viewport"]');
		if (viewportMeta) {
			// 2. 뷰포트 설정을 고정
			viewportMeta.setAttribute(
				'content',
				'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
			);
			// - width=device-width: 화면 너비를 기기 너비에 맞춤
			// - initial-scale=1.0: 기본 확대 비율 1배
			// - maximum-scale=1.0: 최대 확대 비율 1배(더 이상 확대 불가)
			// - user-scalable=no: 사용자가 확대/축소(핀치줌) 불가
		}

		// 3. 더블탭/멀티터치로 인한 확대 방지 이벤트 핸들러
		const preventDoubleTapZoom = (e: TouchEvent) => {
			if (e.touches.length > 1) {
				// 두 손가락 이상 터치 시(멀티터치) 기본 동작(줌) 막기
				e.preventDefault();
			}
		};

		// 4. 터치 시작 시 위 이벤트 핸들러 등록
		document.addEventListener('touchstart', preventDoubleTapZoom, {
			passive: false, // preventDefault를 사용하려면 passive: false여야 함
		});

		// 5. 컴포넌트 언마운트 시 이벤트 핸들러 해제(메모리 누수 방지)
		return () => {
			document.removeEventListener('touchstart', preventDoubleTapZoom);
		};
	}, []);

	// [9] 뒤로가기 버튼 핸들러
	// - 이전 페이지로 이동 (없으면 홈으로)
	const handleBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	// [10] "다음" 버튼 클릭 시
	// - 코디 아이템이 1개 이상이면 localStorage에 저장 후 저장 페이지로 이동
	// - 추천/내 모드에 따라 state 분기
	const handleNextClick = () => {
		if (canvasItems.length === 0) {
			toast.error('최소 하나 이상의 옷을 코디에 담아야 합니다.');
			return;
		}
		// 1. 현재 코디 아이템들을 localstorage에 저장
		localStorage.setItem('codiItems', JSON.stringify(canvasItems));
		// [참고] 캡처/썸네일 생성은 CodiSavePage에서 requestAnimationFrame으로 처리됨
		// ex)
		// requestAnimationFrame(() => { ...capture code... });
		if (isRecommendedMode) {
			// 2. 추천 모드일 경우 멤버 아이디를 전달
			navigate('/codi/save', {
				state: {
					mode: 'recommended',
					targetMemberId: memberId,
				},
			});
		} else {
			// 3. 내 모드일 경우 현재 멤버 아이디를 전달
			navigate('/codi/save', {
				state: {
					mode: 'my',
				},
			});
		}
	};

	// [헤더 props] - 상단 헤더에 전달
	const headerProps = {
		showBack: true, // 뒤로가기 버튼 표시
		badgeText: '다음', // 우측 버튼 텍스트
		onBackClick: handleBackClick, // 뒤로가기 핸들러
		onBadgeClick: handleNextClick, // 다음(저장) 핸들러
	};

	// [11] 저장 페이지에서 돌아온 경우, localStorage에서 코디 아이템 복구
	// - 저장 페이지에서 뒤로 오면 기존 코디 아이템 복원
	useEffect(() => {
		if (location.state?.from === 'save') {
			// localstorage에 임시로 저장해둔 아이템 목록을 불러옴
			// 기존 작업을 날리지 않고 복원시키기 위함
			const savedItems = localStorage.getItem('codiItems');

			if (savedItems) {
				try {
					// localstorage에 저장된 아이템 목록을 파싱 -> 문자열만 저장하기 때문에
					const parsedItems = JSON.parse(savedItems);
					//원래 객체로 복구하는 로직이 필요함
					if (Array.isArray(parsedItems)) {
						setCanvasItems(parsedItems);
					}
				} catch (error) {
					console.error('코디 아이템 복구 실패', error);
				}
			}
		}
	}, [location.state?.from]);

	// [렌더링 구조]
	// - 전체 화면: 상단 헤더, 중간(코디 캔버스), 하단(아이템 목록)
	return (
		<div className='w-full h-screen flex flex-col bg-white overflow-hidden'>
			{/* [상단 헤더] - 뒤로가기/다음 버튼 등 전달 */}
			<Header {...headerProps} />
			<div className='flex-1 flex flex-col overflow-hidden bg-gray-50 relative z-0 h-screen'>
				<div className='flex-shrink-0'>
					{/* [코디 캔버스] - 실제 코디 아이템(옷 등)들이 배치되는 영역
						- 드래그/회전/삭제 등 편집 가능
						- props로 현재 아이템, 수정/삭제 핸들러, zIndex 관리 등 전달 */}
					<CodiCanvas
						items={canvasItems} // 현재 올려진 아이템들
						isEditable={true} // 편집 가능
						updateItem={updateCanvasItem} // 아이템 수정 핸들러
						removeItem={removeFromCanvas} // 아이템 삭제 핸들러
						maxZIndex={maxZIndex} // z-index 관리
						setMaxZIndex={setMaxZIndex} // z-index setter
					/>
				</div>
				{/* [하단: 웹/모바일 분기] - 카테고리별 아이템 목록 UI
					- isWeb: true면 웹(아코디언), false면 모바일(섹션)
					- 각 아이템 클릭 시 addItemToCanvas로 캔버스에 추가 */}
				{isWeb ? (
					// [웹] 아코디언 형태의 카테고리/아이템 목록
					<CodiEditBottomAccordion
						categories={CATEGORIES} // 카테고리 목록
						activeCategory={activeCategory} // 현재 선택 카테고리
						filteredProducts={(
							products?.pages.flatMap((page) => page.content) || []
						)
							// 추천 모드면 공개 아이템만, 아니면 전체
							.filter((item) => {
								if (isRecommendedMode) return item.isPublic;
								return true;
							})
							// 아이템 정보(카테고리명, 브랜드 등) 가공
							.map((item) => ({
								id: item.id,
								imageUrl: item.image,
								name: item.name,
								image: item.image,
								brand: item.brandName,
								category:
									activeCategory === 'all'
										? '전체'
										: CATEGORIES.find((cat) => cat.id === activeCategory)
												?.label || '전체',
								isPublic: item.isPublic,
							}))}
						onCategoryChange={setActiveCategory} // 카테고리 변경 핸들러
						onItemClick={addItemToCanvas} // 아이템 클릭 시 캔버스에 추가
					/>
				) : (
					// [모바일] 하단 섹션 형태의 카테고리/아이템 목록
					<CodiEditBottomSection
						categories={CATEGORIES}
						activeCategory={activeCategory}
						filteredProducts={(
							products?.pages.flatMap((page) => page.content) || []
						)
							.filter((item) => {
								if (isRecommendedMode) return item.isPublic;
								return true;
							})
							.map((item) => ({
								id: item.id,
								imageUrl: item.image,
								name: item.name,
								image: item.image,
								brand: item.brandName,
								category:
									activeCategory === 'all'
										? '전체'
										: CATEGORIES.find((cat) => cat.id === activeCategory)
												?.label || '전체',
								isPublic: item.isPublic,
							}))}
						onCategoryChange={setActiveCategory}
						onItemClick={addItemToCanvas}
					/>
				)}
			</div>
		</div>
	);
};

export default CodiEditPage;
