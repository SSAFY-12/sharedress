import { useInfiniteQuery } from '@tanstack/react-query';
import { ClosetResponse, fetchCloset } from '@/features/closet/api/closetApi';

// [옷장 무한 스크롤 데이터 훅]
// - memberId(필수): 조회할 멤버(사용자) ID
// - categoryId(선택): 카테고리별 필터링(숫자)
// - TanStack Query의 useInfiniteQuery를 사용해 무한 스크롤 지원
export const useCloset = (memberId: number, categoryId?: number) =>
	useInfiniteQuery<ClosetResponse>({
		// [queryKey] - 쿼리 캐싱/식별용 키 (멤버, 카테고리별로 분리)
		queryKey: ['closet', memberId, categoryId],
		// [queryFn] - 실제 데이터 패칭 함수 (API 호출)
		queryFn: ({ pageParam }) =>
			fetchCloset({
				memberId, // 조회할 멤버 ID
				categoryId, // 카테고리 ID(없으면 전체)
				cursor: pageParam as number | undefined, // 페이지네이션 커서
			}),
		// [getNextPageParam] - 다음 페이지 커서 추출 (없으면 undefined)
		getNextPageParam: (lastPage) => lastPage.pagination.cursor ?? undefined,
		// [initialPageParam] - 첫 페이지 커서(undefined로 시작)
		initialPageParam: undefined,
		// [staleTime] - 데이터 신선도(5초간 fresh)
		staleTime: 1000 * 5,
		// [placeholderData] - 쿼리 초기값(로딩 전 임시 데이터)
		placeholderData: () => ({
			pages: [],
			pageParams: [],
		}),
	});
