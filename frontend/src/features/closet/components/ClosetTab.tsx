import { ClothItem } from '@/components/cards/cloth-card';
import { ClothListContainer } from '@/containers/ClothListContainer';
import { useNavigate } from 'react-router-dom';
import { useCloset } from '@/features/closet/hooks/useCloset';
import { useEffect, useRef } from 'react';
import { ClosetItem } from '@/features/closet/api/closetApi';

interface ClosetTabProps {
	memberId: number;
	selectedCategory: string;
	isMe: boolean;
}

// 카테고리 ID 매핑 (API 호출용)
const CATEGORY_ID_MAP: { [key: string]: number } = {
	아우터: 2,
	상의: 1,
	하의: 3,
	신발: 4,
	기타: 5,
};

const ClosetTab = ({ memberId, selectedCategory, isMe }: ClosetTabProps) => {
	const navigate = useNavigate();

	const categoryId =
		selectedCategory === '전체' ? undefined : CATEGORY_ID_MAP[selectedCategory];

	const {
		data,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		isFetching,
		isLoading,
	} = useCloset(memberId, categoryId);

	const sentinel = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!sentinel.current) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ root: null, threshold: 0.1 },
		);
		io.observe(sentinel.current);
		return () => io.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const allItems = data?.pages.flatMap((page) => page.content) ?? [];
	const visibleItems = allItems.filter(
		(item: ClosetItem) => isMe || item.isPublic,
	);

	const handleItemClick = (item: ClothItem) => {
		navigate(`/cloth/${item.id}`, {
			state: { isMe, ownerId: memberId },
		});
	};

	return (
		<div className='flex flex-col h-full'>
			{(visibleItems.length ?? 0) === 0 ? (
				<div className='flex-1 flex items-center justify-center text-description text-descriptionColor'>
					저장한 옷이 없습니다.
				</div>
			) : (
				<div className='flex-1 px-4'>
					<ClothListContainer
						items={visibleItems.map((item: ClosetItem) => ({
							id: item.id,
							category: selectedCategory,
							imageUrl: item.image,
							name: item.name,
							brand: item.brandName,
							isPublic: item.isPublic,
						}))}
						onItemClick={handleItemClick}
						columns={3}
						className='mt-1'
						type='cloth'
						scrollRef={sentinel}
						isLoading={isLoading}
						isFetching={isFetching}
						isFetchingNextPage={isFetchingNextPage}
					/>
				</div>
			)}
		</div>
	);
};

export default ClosetTab;
