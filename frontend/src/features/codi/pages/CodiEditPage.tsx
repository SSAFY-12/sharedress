import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiEditBottomSection from '@/features/codi/components/CodiEditBottomSection';
import { useProfileStore } from '@/store/useProfileStore';
import { useCloset } from '@/features/closet/hooks/useCloset';
import { toast } from 'react-toastify';
import { ClosetResponse } from '@/features/closet/api/closetApi';
import { useAuthStore } from '@/store/useAuthStore';
import { CodiTutorialModal } from '../components/CodiTutorialModal';

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
	const memberId =
		mode === 'recommended'
			? targetMemberId
			: useProfileStore((state) => state.getMyId()) ?? 0;

	const isGuest = useAuthStore((state) => state.isGuest);

	// 카테고리 상태
	const [activeCategory, setActiveCategory] = useState('all');
	const categoryId =
		activeCategory === 'all' ? undefined : Number(activeCategory);

	const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null);

	// 옷장 데이터 조회
	const {
		data: products,
		isFetchingNextPage,
		fetchNextPage,
	} = useCloset(memberId, categoryId);

	// 코디에 올려진 아이템들 상태
	const [canvasItems, setCanvasItems] = useState<any[]>([]);

	// 튜토리얼 모달 상태
	const [isTutorialOpen, setIsTutorialOpen] = useState(false);

	const addItemToCanvas = (item: any) => {
		const newItem = {
			...item,
			canvasId: `canvas-${item.id}-${Date.now()}`,
			position: { x: 0, y: 0 },
			rotation: 0,
			scale: 1,
			zIndex: 0,
			imageUrl: item.imageUrl,
		};
		setCanvasItems([...canvasItems, newItem]);
		setActiveCanvasId(newItem.canvasId);
	};

	const updateCanvasItem = (updatedItem: any) => {
		setCanvasItems((prevItems) => {
			const rest = prevItems.filter(
				(item) => item.canvasId !== updatedItem.canvasId,
			);
			return [...rest, updatedItem];
		});
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

	useEffect(() => {
		if (isGuest && mode === 'recommended') {
			setIsTutorialOpen(true);
		}
	}, [isGuest, mode]);

	const handleBackClick = () => {
		if (mode === 'my') {
			navigate('/mypage');
		} else {
			if (isGuest) {
				navigate(`/link/friend/${targetMemberId}`);
			} else {
				navigate(`/friend/${targetMemberId}`);
			}
		}
	};

	const handleNextClick = () => {
		if (canvasItems.length === 0) {
			toast.error('최소 하나 이상의 옷을 코디에 담아야 합니다.');
			return;
		}
		localStorage.setItem('codiItems', JSON.stringify(canvasItems));
		if (mode === 'recommended') {
			if (isGuest) {
				navigate('/link/codi/save', {
					state: { mode: 'recommended', targetMemberId: targetMemberId },
				});
			} else {
				navigate('/codi/save', {
					state: { mode: 'recommended', targetMemberId: targetMemberId },
				});
			}
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
		<>
			{/* 모바일 레이아웃 */}
			<div className='block sm:hidden min-h-screen bg-white w-full'>
				<div className='w-full h-screen flex flex-col bg-white'>
					<Header {...headerProps} />
					<div className='flex-1 flex flex-col overflow-hidden bg-gray-50 relative z-0 h-screen'>
						<div className='flex-shrink-0 w-full aspect-[10/11] bg-gray-50 flex items-center justify-center overflow-hidden'>
							<CodiCanvas
								items={canvasItems}
								isEditable={true}
								updateItem={updateCanvasItem}
								removeItem={removeFromCanvas}
								activeItem={activeCanvasId}
								setActiveItem={setActiveCanvasId}
								width={window.innerWidth}
								height={window.innerWidth * 1.1}
							/>
						</div>
						<CodiEditBottomSection
							categories={CATEGORIES}
							activeCategory={activeCategory}
							filteredProducts={(
								products?.pages.flatMap(
									(page: ClosetResponse) => page.content,
								) || []
							)
								.filter((item) => {
									if (mode === 'recommended') return item.isPublic;
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
							onCategoryChange={(category) => setActiveCategory(category)}
							onItemClick={addItemToCanvas}
							hasNextPage={
								!!products?.pages[products.pages.length - 1]?.pagination.cursor
							}
							isFetchingNextPage={isFetchingNextPage}
							fetchNextPage={fetchNextPage}
						/>
					</div>
				</div>
			</div>

			{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
			<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
				<div className='w-[560px] h-screen bg-white rounded-xl overflow-hidden shadow-xl flex flex-col'>
					<Header {...headerProps} />
					<div className='flex-1 flex flex-col overflow-hidden bg-gray-50 relative z-0 h-screen'>
						<div className='flex-shrink-0 w-[400px] h-[440px] self-center rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden mt-4'>
							<CodiCanvas
								items={canvasItems}
								isEditable={true}
								updateItem={updateCanvasItem}
								removeItem={removeFromCanvas}
								activeItem={activeCanvasId}
								setActiveItem={setActiveCanvasId}
							/>
						</div>
						<CodiEditBottomSection
							categories={CATEGORIES}
							activeCategory={activeCategory}
							filteredProducts={(
								products?.pages.flatMap(
									(page: ClosetResponse) => page.content,
								) || []
							)
								.filter((item) => {
									if (mode === 'recommended') return item.isPublic;
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
							onCategoryChange={(category) => setActiveCategory(category)}
							onItemClick={addItemToCanvas}
							hasNextPage={
								!!products?.pages[products.pages.length - 1]?.pagination.cursor
							}
							isFetchingNextPage={isFetchingNextPage}
							fetchNextPage={fetchNextPage}
						/>
					</div>
				</div>
			</div>
			{isTutorialOpen && (
				<CodiTutorialModal
					isOpen={isTutorialOpen}
					onClose={() => setIsTutorialOpen(false)}
				/>
			)}
		</>
	);
};

export default CodiEditPage;
