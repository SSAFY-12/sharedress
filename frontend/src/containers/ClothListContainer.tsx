import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothCard } from '@/components/cards/cloth-card/ClothCard';
import { ClothCardRegist } from '@/features/regist/components/ClothCardRegist';
import { ForwardedRef, forwardRef } from 'react';
import { ClothCardRegistEmpty } from '@/features/regist/components/ClothCardRegistEmpty';

interface ClothListContainerProps {
	items: ClothItem[];
	onItemClick?: (item: ClothItem) => void;
	columns?: 2 | 3;
	className?: string;
	isForRegist?: boolean;
	isLoading?: boolean;
	isFetching?: boolean;
	isFetchingNextPage?: boolean;
	scrollRef?: ForwardedRef<HTMLDivElement>;
	type?: 'cloth' | 'codi';
}

const ClothListContainer = forwardRef<HTMLDivElement, ClothListContainerProps>(
	({
		items,
		onItemClick,
		columns = 3,
		className = '',
		isForRegist = false,
		isLoading = false,
		isFetching = false,
		isFetchingNextPage = false,
		scrollRef,
		type = 'cloth',
	}) => (
		<div className={`${className} flex flex-col h-full `}>
			{/* 스크롤 가능한 컨텐츠 영역 */}
			<div className='flex-1 overflow-y-auto'>
				<div
					className={`grid w-full gap-x-2.5 gap-y-5 ${
						//예승이는 3.5로 설정정
						columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
					}`}
				>
					{(isLoading || isFetching) && !isFetchingNextPage ? (
						<>
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
						</>
					) : (
						items.map((item) =>
							!isForRegist ? (
								<ClothCard
									key={item.id}
									item={item}
									onClick={() => onItemClick?.(item)}
									className='w-full aspect-[10/11]'
									type={type}
								/>
							) : (
								<ClothCardRegist
									key={item.id}
									item={item}
									className='flex flex-col w-full gap-2.5 items-center'
								/>
							),
						)
					)}
					{isFetchingNextPage && (
						<>
							<ClothCardRegistEmpty />
							<ClothCardRegistEmpty />
						</>
					)}
				</div>
				<div className='h-20' />
				<div ref={scrollRef} className='h-1' />
			</div>
		</div>
	),
);

ClothListContainer.displayName = 'ClothListContainer';

export { ClothListContainer };
