import { useInfiniteQuery } from '@tanstack/react-query';
import { socialApi } from '@/features/social/api/socialApi';
import { SearchUser } from '@/features/social/types/social';

interface SearchUserResponse {
	status: {
		code: string;
		message: string;
	};
	content: SearchUser['content'];
	pagination: {
		size: number;
		hasNext: boolean;
		cursor: number;
	};
}

// 무한 스크롤 구동을 위해 useQuery 대신 useInfiniteQuery 사용
const useSearchUser = (nickname: string) => {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery<SearchUserResponse>({
		queryKey: ['searchUser', nickname], //nickname 변경되면 새로운 쿼리 생성
		queryFn: (
			{ pageParam }, //pageParam 타입 지정
		) => socialApi.searchAllUser(nickname, pageParam as number, 10), //page마다 10명씩 조회
		getNextPageParam: (lastPage) => {
			//마지막 페이지에서 다음 페이지 조회
			if (!lastPage.pagination.hasNext) return undefined; //hasNext가 false면 더 이상 조회할 페이지가 없음
			return lastPage.pagination.cursor; //다음 페이지 조회
		},
		initialPageParam: 0, //초기 페이지 번호
		enabled: !!nickname, //nickname이 있을 때만 조회
	});

	const searchUsers = data?.pages.flatMap((page) => page.content) ?? [];
	// 모든 페이지의 content를 하나의 배열로 합침
	// 배열의 각 페이지에서 content 배열만 추출하여 하나의 큰 배열로 합치는 역할을 함

	return {
		searchUsers, //검색 결과
		fetchNextPage, //다음 페이지 조회
		hasNextPage, //다음 페이지 조회 가능 여부
		isFetchingNextPage, //다음 페이지 조회 중 여부
		isLoading, //로딩 여부
		error, //에러 여부
	};
};

export default useSearchUser;
