import { useRef } from 'react';

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
	initialWidth?: number;
	initialHeight?: number;
}

interface ResultCodiCanvasProps {
	items: CanvasItem[];
}

const ResultCodiCanvas = ({ items }: ResultCodiCanvasProps) => {
	const canvasRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={canvasRef}
			className='relative w-full bg-gray-50 overflow-hidden'
			style={{ paddingBottom: '110%' }}
		>
			{items.length === 0 && (
				<div className='absolute inset-0 flex items-center justify-center text-description'>
					선택된 아이템이 없습니다
				</div>
			)}

			{items.map((item) => (
				<div
					key={item.canvasId}
					className='absolute'
					style={{
						left: `${item.position.x}px`,
						top: `${item.position.y}px`,
						transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
						zIndex: item.zIndex,
					}}
				>
					{/* 아이템 이미지 */}
					<div className='relative'>
						<img
							src={item.imageUrl || 'https://picsum.photos/200'}
							alt={item.name}
							className='object-contain select-none'
							style={{
								width: item.initialWidth ? `${item.initialWidth}px` : 'auto',
								height: item.initialHeight ? `${item.initialHeight}px` : 'auto',
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default ResultCodiCanvas;
