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

// [구조 안내] "다음" 버튼 클릭 시 localStorage에 코디 아이템을 저장하고,
//  CodiSavePage로 이동
// 실제 썸네일 캡처는 CodiSavePage에서 React Portal 구조로 body에 직접 CodiCanvas를 렌더하여 진행
// (이 파일에서는 Portal 직접 사용 X)

// [카테고리 목록]
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

	// 모드/멤버 정보 세팅
	const mode = location.state?.mode ?? 'my';
	const targetMemberId = location.state?.targetMemberId ?? 0;
	const isWeb = useMediaQuery('(min-width: 640px)');
	const isRecommendedMode = mode === 'recommended';
	const memberId = isRecommendedMode
		? targetMemberId
		: useProfileStore((state) => state.getMyId()) ?? 0;

	// 카테고리 상태
	const [activeCategory, setActiveCategory] = useState('all');
	const categoryId =
		activeCategory === 'all' ? undefined : Number(activeCategory);

	// 옷장 데이터 조회
	const { data: products } = useCloset(memberId, categoryId);

	// 코디에 올려진 아이템들 상태
	const [canvasItems, setCanvasItems] = useState<any[]>([]);
	const [maxZIndex, setMaxZIndex] = useState(0);

	const addItemToCanvas = (item: any) => {
		const currentMaxZIndex =
			canvasItems.length > 0
				? Math.max(...canvasItems.map((item) => item.zIndex))
				: 0;
		const newZIndex = currentMaxZIndex + 1;
		const newItem = {
			...item,
			canvasId: `canvas-${item.id}-${Date.now()}`,
			position: { x: 0, y: 0 },
			rotation: 0,
			scale: 1,
			zIndex: newZIndex,
			imageUrl: item.imageUrl,
		};
		setMaxZIndex(newZIndex);
		setCanvasItems([...canvasItems, newItem]);
	};

	const updateCanvasItem = (updatedItem: any) => {
		if (updatedItem.zIndex > maxZIndex) setMaxZIndex(updatedItem.zIndex);
		setCanvasItems(
			canvasItems.map((item) =>
				item.canvasId === updatedItem.canvasId ? updatedItem : item,
			),
		);
	};

	const removeFromCanvas = (canvasId: string) => {
		setCanvasItems(canvasItems.filter((item) => item.canvasId !== canvasId));
	};

	// 모바일 UX 개선: viewport 고정, 더블탭 줌 방지
	useEffect(() => {
		const viewportMeta = document.querySelector('meta[name="viewport"]');
		if (viewportMeta) {
			viewportMeta.setAttribute(
				'content',
				'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
			);
		}
		const preventDoubleTapZoom = (e: TouchEvent) => {
			if (e.touches.length > 1) e.preventDefault();
		};
		document.addEventListener('touchstart', preventDoubleTapZoom, {
			passive: false,
		});
		return () => {
			document.removeEventListener('touchstart', preventDoubleTapZoom);
		};
	}, []);

	const handleBackClick = () => {
		if (window.history.length > 1) navigate(-1);
		else navigate('/');
	};

	const handleNextClick = () => {
		if (canvasItems.length === 0) {
			toast.error('최소 하나 이상의 옷을 코디에 담아야 합니다.');
			return;
		}
		localStorage.setItem('codiItems', JSON.stringify(canvasItems));
		if (isRecommendedMode) {
			navigate('/codi/save', {
				state: { mode: 'recommended', targetMemberId: memberId },
			});
		} else {
			navigate('/codi/save', { state: { mode: 'my' } });
		}
	};

	const headerProps = {
		showBack: true,
		badgeText: '다음',
		onBackClick: handleBackClick,
		onBadgeClick: handleNextClick,
	};

	useEffect(() => {
		if (location.state?.from === 'save') {
			const savedItems = localStorage.getItem('codiItems');
			if (savedItems) {
				try {
					const parsedItems = JSON.parse(savedItems);
					if (Array.isArray(parsedItems)) setCanvasItems(parsedItems);
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
