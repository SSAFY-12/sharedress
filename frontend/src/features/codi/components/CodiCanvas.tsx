import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Move, Trash2 } from 'lucide-react';

interface CanvasItem {
	canvasId: string;
	id: string;
	imageUrl: string;
	name: string;
	brand: string;
	category: string;
	position: {
		x: number;
		y: number;
	};
	rotation: number;
	scale: number;
	zIndex: number;
	aspectRatio?: number;
	initialWidth?: number;
	initialHeight?: number;
	isLoaded?: boolean; // 이미지 로드 상태 추적 변수
}

interface CodiCanvasProps {
	items: CanvasItem[];
	updateItem: (item: CanvasItem) => void;
	removeItem: (id: string) => void;
	maxZIndex: number;
	setMaxZIndex: (value: number) => void;
}

// 카테고리별 기본 크기 설정
const DEFAULT_HEIGHT = 120;
const DEFAULT_WIDTH = 80;

// 너비 기준 카테고리 목록
const WIDTH_BASED_CATEGORIES = ['shoes'];

const CodiCanvas = (props: CodiCanvasProps) => {
	const [activeItem, setActiveItem] = useState<string | null>(null);
	const [interactionMode, setInteractionMode] = useState<
		'move' | 'transform' | null
	>(null);
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
	const [startValues, setStartValues] = useState({
		rotation: 0,
		scale: 1,
		position: { x: 0, y: 0 },
	});
	const canvasRef = useRef<HTMLDivElement>(null);
	const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

	const handleImageLoad = (
		e: React.SyntheticEvent<HTMLImageElement>,
		item: CanvasItem,
	) => {
		const img = e.currentTarget;
		const aspectRatio = img.naturalWidth / img.naturalHeight;

		imageRefs.current.set(item.canvasId, img);

		let initialWidth, initialHeight;

		if (WIDTH_BASED_CATEGORIES.includes(item.category)) {
			initialWidth = DEFAULT_WIDTH;
			initialHeight = DEFAULT_WIDTH / aspectRatio;
		} else {
			initialHeight = DEFAULT_HEIGHT;
			initialWidth = DEFAULT_HEIGHT * aspectRatio;
		}

		props.updateItem({
			...item,
			aspectRatio,
			initialWidth,
			initialHeight,
			isLoaded: true,
		});
	};

	const handleItemSelect = useCallback(
		(e: React.MouseEvent | React.TouchEvent, canvasId: string) => {
			e.stopPropagation();

			if (activeItem === canvasId) return;

			const item = props.items.find((item) => item.canvasId === canvasId);
			if (item) {
				const newZIndex = props.maxZIndex + 1;
				props.setMaxZIndex(newZIndex);
				props.updateItem({
					...item,
					zIndex: newZIndex,
				});
				setActiveItem(canvasId);
			}
		},
		[activeItem, props],
	);

	const handleCanvasClick = useCallback(() => {
		setActiveItem(null);
		setInteractionMode(null);
	}, []);

	const handleMoveStart = useCallback(
		(e: React.MouseEvent | React.TouchEvent, item: CanvasItem) => {
			e.stopPropagation();

			const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
			const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

			setInteractionMode('move');
			setActiveItem(item.canvasId);

			const newZIndex = props.maxZIndex + 1;
			props.setMaxZIndex(newZIndex);
			props.updateItem({
				...item,
				zIndex: newZIndex,
			});

			setStartPoint({ x: clientX, y: clientY });
			setStartValues({
				position: { ...item.position },
				rotation: item.rotation,
				scale: item.scale,
			});
		},
		[props],
	);

	const handleTransformStart = useCallback(
		(e: React.MouseEvent | React.TouchEvent, item: CanvasItem) => {
			e.stopPropagation();

			const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
			const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

			setInteractionMode('transform');
			setActiveItem(item.canvasId);

			const newZIndex = props.maxZIndex + 1;
			props.setMaxZIndex(newZIndex);
			props.updateItem({
				...item,
				zIndex: newZIndex,
			});

			const itemElement = document.getElementById(item.canvasId);
			if (itemElement) {
				const rect = itemElement.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				const dx = clientX - centerX;
				const dy = clientY - centerY;
				const startAngle = Math.atan2(dy, dx);
				const startDistance = Math.sqrt(dx * dx + dy * dy);

				setStartPoint({ x: centerX, y: centerY });
				setStartValues({
					position: { ...item.position },
					rotation: item.rotation - startAngle * (180 / Math.PI),
					scale: (item.scale / startDistance) * 100,
				});
			}
		},
		[props],
	);

	const handleMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!activeItem || !interactionMode) return;

			const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
			const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

			const activeItemObj = props.items.find(
				(item) => item.canvasId === activeItem,
			);
			if (!activeItemObj) return;

			if (interactionMode === 'move') {
				const deltaX = clientX - startPoint.x;
				const deltaY = clientY - startPoint.y;

				props.updateItem({
					...activeItemObj,
					position: {
						x: startValues.position.x + deltaX,
						y: startValues.position.y + deltaY,
					},
				});
			} else if (interactionMode === 'transform') {
				const dx = clientX - startPoint.x;
				const dy = clientY - startPoint.y;
				const angle = Math.atan2(dy, dx) * (180 / Math.PI);
				const distance = Math.sqrt(dx * dx + dy * dy);

				const newScale = Math.max(
					0.5,
					Math.min(3.0, (startValues.scale * distance) / 100),
				);

				props.updateItem({
					...activeItemObj,
					rotation: startValues.rotation + angle,
					scale: newScale,
				});
			}
		},
		[activeItem, interactionMode, props, startPoint, startValues],
	);

	const handleInteractionEnd = useCallback(() => {
		setInteractionMode(null);
	}, []);

	const handleDelete = useCallback(
		(e: React.MouseEvent | React.TouchEvent, canvasId: string) => {
			e.stopPropagation();
			props.removeItem(canvasId);
			setActiveItem(null);
			setInteractionMode(null);
		},
		[props],
	);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => handleMove(e);
		const handleTouchMove = (e: TouchEvent) => handleMove(e);

		const handleMouseUp = () => handleInteractionEnd();
		const handleTouchEnd = () => handleInteractionEnd();

		if (interactionMode) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('touchmove', handleTouchMove, { passive: false });
			window.addEventListener('mouseup', handleMouseUp);
			window.addEventListener('touchend', handleTouchEnd);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('touchend', handleTouchEnd);
		};
	}, [interactionMode, handleMove, handleInteractionEnd]);

	useEffect(() => {
		const preventDefaultTouch = (e: TouchEvent) => {
			if (interactionMode) {
				e.preventDefault();
			}
		};

		window.addEventListener('touchmove', preventDefaultTouch, {
			passive: false,
		});

		return () => {
			window.removeEventListener('touchmove', preventDefaultTouch);
		};
	}, [interactionMode]);

	return (
		<div
			ref={canvasRef}
			className='relative w-full aspect-square bg-gray-50 overflow-hidden touch-pan-x'
			onClick={handleCanvasClick}
			onTouchEnd={handleCanvasClick}
		>
			{props.items.length === 0 && (
				<div className='absolute inset-0 flex items-center justify-center text-gray-400'>
					아이템을 선택하여 코디를 만들어보세요
				</div>
			)}

			{props.items.map((item) => (
				<div
					id={item.canvasId}
					key={item.canvasId}
					className={`absolute ${
						activeItem === item.canvasId
							? 'outline outline-1 outline-dashed outline-gray-400'
							: ''
					}`}
					style={{
						left: `${item.position.x}px`,
						top: `${item.position.y}px`,
						transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
						transformOrigin: 'center',
						zIndex: item.zIndex,
						opacity: item.isLoaded ? 1 : 0,
						transition: 'opaticy 0.2s ease-in-out',
					}}
					onClick={(e) => handleItemSelect(e, item.canvasId)}
					onTouchStart={(e) => handleItemSelect(e, item.canvasId)}
				>
					{/* 아이템 이미지 */}
					<div
						className='relative cursor-move'
						onMouseDown={(e) => handleMoveStart(e, item)}
						onTouchStart={(e) => handleMoveStart(e, item)}
					>
						<img
							src={item.imageUrl || 'https://picsum.photos/200'}
							alt={item.name}
							className='object-contain select-none'
							style={{
								width: item.initialWidth ? `${item.initialWidth}px` : 'auto',
								height: item.initialHeight ? `${item.initialHeight}px` : 'auto',
								minWidth: '40px',
								minHeight: '40px',
							}}
							draggable={false}
							onLoad={(e) => handleImageLoad(e, item)}
						/>
					</div>

					{/* 선택된 아이템의 컨트롤 핸들 */}
					{activeItem === item.canvasId && (
						<>
							{/* 회전 및 확대축소 핸들 */}
							<div
								className='absolute -bottom-2 -right-2 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center cursor-move border border-gray-300 hover:bg-gray-50 active:bg-gray-100'
								onMouseDown={(e) => handleTransformStart(e, item)}
								onTouchStart={(e) => handleTransformStart(e, item)}
							>
								<Move size={12} className='text-gray-400' />
							</div>

							{/* 삭제 버튼 */}
							<div
								className='absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-red-600 active:bg-red-700'
								onClick={(e) => handleDelete(e, item.canvasId)}
								onTouchStart={(e) => handleDelete(e, item.canvasId)}
							>
								<Trash2 size={12} className='text-white' />
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default CodiCanvas;
