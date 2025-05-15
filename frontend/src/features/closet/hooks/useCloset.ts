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

// export const useCloset = (memberId: number, categoryId?: number) => {
//  const setCloset = useClosetStore((state) => state.setCloset);

//  return useQuery<ClosetItem[]>({
//      queryKey: ['closet', memberId, categoryId],
//      queryFn: async () => {
//          const data = await fetchCloset({ memberId, categoryId });
//          // 비동기로 주스탄드에 업데이트
//          Promise.resolve().then(() => {
//              setCloset(
//                  data.map((item) => ({
//                      closetId: item.id,
//                      libraryId: item.libraryId,
//                  })),
//              );
//          });
//          return data;
//      },
//  });
// };
