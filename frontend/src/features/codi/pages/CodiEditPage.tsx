import { useEffect, useState } from 'react';
import { ClothListContainer } from '@/containers/ClothListContainer';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiCategoryTabs from '@/features/codi/components/CodiCategoryTabs';
import Header from '@/components/layouts/Header';

const CodiEditPage = () => {
	const categories = [
		{ id: 'all', label: '전체' },
		{ id: 'top', label: '상의' },
		{ id: 'bottom', label: '하의' },
		{ id: 'outer', label: '아우터' },
		{ id: 'shoes', label: '신발' },
		{ id: 'etc', label: '기타' },
	];

	const products = [
		{
			id: '1',
			imageUrl: 'https://picsum.photos/200',
			name: '체크 셔츠',
			brand: 'INTHERAW',
			category: 'top',
		},
		{
			id: '2',
			imageUrl: 'https://picsum.photos/200',
			name: '화이트 티셔츠',
			brand: 'INTHERAW',
			category: 'top',
		},
		{
			id: '3',
			imageUrl: 'https://picsum.photos/200',
			name: '네이비 팬츠',
			brand: 'INTHERAW',
			category: 'bottom',
		},
		{
			id: '4',
			imageUrl: 'https://picsum.photos/200',
			name: '브라운 가죽 벨트',
			brand: 'INTHERAW',
			category: 'etc',
		},
		{
			id: '5',
			imageUrl: 'https://picsum.photos/200',
			name: '블랙 드레스 슈즈',
			brand: 'Dr.Martens',
			category: 'shoes',
		},
		{
			id: '6',
			imageUrl: 'https://picsum.photos/200',
			name: '베이지 재킷',
			brand: '도날드덕 잠옷',
			category: 'outer',
		},
		{
			id: '7',
			imageUrl: 'https://picsum.photos/200',
			name: '옷',
			brand: '브랜드',
			category: 'shoes',
		},
		{
			id: '8',
			imageUrl: 'https://picsum.photos/200',
			name: '옷',
			brand: '브랜드',
			category: 'bottom',
		},
		{
			id: '9',
			imageUrl: 'https://picsum.photos/200',
			name: '옷',
			brand: '브랜드',
			category: 'outer',
		},
		{
			id: '10',
			imageUrl: 'https://picsum.photos/200',
			name: '옷',
			brand: '브랜드',
			category: 'etc',
		},
	];

	// 상태 관리
	const [activeCategory, setActiveCategory] = useState('all');
	const [canvasItems, setCanvasItems] = useState<any[]>([]);
	const [maxZIndex, setMaxZIndex] = useState(0);

	// 카테고리 필터링
	const filteredProducts =
		activeCategory === 'all'
			? products
			: products.filter((product) => product.category === activeCategory);

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
	});

	return (
		<div className='max-w-md mx-auto h-screen flex flex-col bg-white overflow-hidden'>
			<Header showBack={true} badgeText='다음' />
			<div className='flex-1 flex flex-col overflow-hidden'>
				{/* 코디 캔버스 부분 */}
				<div className='flex-shrink-0'>
					<CodiCanvas
						items={canvasItems}
						updateItem={updateCanvasItem}
						removeItem={removeFromCanvas}
						maxZIndex={maxZIndex}
						setMaxZIndex={setMaxZIndex}
					/>
				</div>

				{/* 아이템 선택 영역 */}
				<div className='flex-1 flex flex-col min-h-0 bg-white border-t border-gray-100'>
					{/* 카테고리 탭 */}
					<div className='flex-shrink-0'>
						<CodiCategoryTabs
							categories={categories}
							activeCategory={activeCategory}
							onCategoryChange={setActiveCategory}
						/>
					</div>

					{/* 옷 나열되는 부분 */}
					<div className='flex-1 overflow-y-auto'>
						<div className='p-4'>
							<ClothListContainer
								items={filteredProducts}
								onItemClick={addItemToCanvas}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CodiEditPage;
