import { useInfiniteQuery } from '@tanstack/react-query';
import { ClosetResponse, fetchCloset } from '@/features/closet/api/closetApi';

export const useCloset = (memberId: number, categoryId?: number) =>
	useInfiniteQuery<ClosetResponse>({
		queryKey: ['closet', memberId, categoryId],
		queryFn: ({ pageParam }) =>
			fetchCloset({
				memberId,
				categoryId,
				cursor: pageParam as number | undefined,
			}),
		getNextPageParam: (lastPage) => lastPage.pagination.cursor ?? undefined,
		initialPageParam: undefined,
		staleTime: 1000 * 5,
		placeholderData: () => ({
			pages: [],
			pageParams: [],
		}),
	});
