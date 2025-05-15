import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiEditBottomSection from '@/features/codi/components/CodiEditBottomSection';
import { useProfileStore } from '@/store/useProfileStore';
import { useCloset } from '@/features/closet/hooks/useCloset';

const CATEGORIES = [
	{ id: 'all', label: '전체' },
	{ id: '2', label: '아우터' },
	{ id: '1', label: '상의' },
	{ id: '3', label: '하의' },
	{ id: '4', label: '신발' },
	{ id: '5', label: '기타' },
];

const CodiEditPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const mode = location.state?.mode ?? 'my';
	const targetMemberId = location.state?.targetMemberId ?? 0;

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

	// 캔버스 아이템 상태
	const [canvasItems, setCanvasItems] = useState<any[]>([]);
	const [maxZIndex, setMaxZIndex] = useState(0);

	// 아이템을 캔버스에 추가하는 함수
	const addItemToCanvas = (item: any) => {
		// 현재 캔버스에 있는 아이템 중 가장 높은 z-index 계산
		const currentMaxZIndex =
			canvasItems.length > 0
				? Math.max(...canvasItems.map((item) => item.zIndex))
				: 0;
		const newZIndex = currentMaxZIndex + 1;
		const newItem = {
			...item,
			canvasId: `canvas-${item.id}-${Date.now()}`,
			position: { x: 100, y: 100 },
			rotation: 0,
			scale: 1,
			zIndex: newZIndex,
			imageUrl: item.imageUrl,
		};

		setMaxZIndex(newZIndex);
		setCanvasItems([...canvasItems, newItem]);
	};

	// 캔버스 아이템 업데이트 함수
	const updateCanvasItem = (updatedItem: any) => {
		if (updatedItem.zIndex > maxZIndex) {
			setMaxZIndex(updatedItem.zIndex);
		}
		setCanvasItems(
			canvasItems.map((item) =>
				item.canvasId === updatedItem.canvasId ? updatedItem : item,
			),
		);
	};

	// 캔버스 아이템 제거 함수
	const removeFromCanvas = (canvasId: string) => {
		setCanvasItems(canvasItems.filter((item) => item.canvasId !== canvasId));
	};

	// PWA 중복 인식 방지 설정
	useEffect(() => {
		const viewportMeta = document.querySelector('meta[name="viewport"]');
		if (viewportMeta) {
			viewportMeta.setAttribute(
				'content',
				'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
			);
		}

		const preventDoubleTapZoom = (e: TouchEvent) => {
			if (e.touches.length > 1) {
				e.preventDefault();
			}
		};

		document.addEventListener('touchstart', preventDoubleTapZoom, {
			passive: false,
		});

		return () => {
			document.removeEventListener('touchstart', preventDoubleTapZoom);
		};
	}, []);

	const handleBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	const handleNextClick = () => {
		if (canvasItems.length === 0) {
			alert('최소 하나 이상의 옷을 코디에 담아야 합니다.');
			return;
		}
		localStorage.setItem('codiItems', JSON.stringify(canvasItems));
		if (isRecommendedMode) {
			navigate('/codi/save', {
				state: {
					mode: 'recommended',
					targetMemberId: memberId,
				},
			});
		} else {
			navigate('/codi/save', {
				state: {
					mode: 'my',
				},
			});
		}
	};

	const headerProps = {
		showBack: true,
		badgeText: '다음',
		onBackClick: handleBackClick,
		onBadgeClick: handleNextClick,
	};

	return (
		<div className='w-full h-screen flex flex-col bg-white overflow-hidden'>
			<Header {...headerProps} />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<div className='flex-shrink-0'>
					<CodiCanvas
						items={canvasItems}
						isEditable={true}
						updateItem={updateCanvasItem}
						removeItem={removeFromCanvas}
						maxZIndex={maxZIndex}
						setMaxZIndex={setMaxZIndex}
					/>
				</div>
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
			</div>
		</div>
	);
};

export default CodiEditPage;
