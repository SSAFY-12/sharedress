import { socialApi } from '@/features/social/api/socialApi';
import { useQuery } from '@tanstack/react-query';
import { SearchFriend } from '@/features/social/types/social';

interface SearchFriendResponse {
	//실제 데이터 응답구조
	status: {
		code: string;
		message: string;
	};
	content: SearchFriend['content']; //실제 데이터 응답구조 -> 키 값
}

interface UseSearchFriendReturn {
	searchMyFriend: SearchFriend['content'] | undefined;
	isLoadingMyFriend: boolean;
	isFetchingMyFriend: boolean;
	errorMyFriend: Error | null;
}

// 친구 검색
const useSearchFriend = (keyword: string): UseSearchFriendReturn => {
	const {
		data: searchMyFriend, // 내 친구리스트 검색
		isLoading: isLoadingMyFriend, // 내 친구리스트 검색 로딩
		isFetching: isFetchingMyFriend, // 내 친구리스트 검색 로딩
		error: errorMyFriend, // 내 친구리스트 검색 에러
	} = useQuery<SearchFriendResponse>({
		// 내 친구리스트 검색
		queryKey: ['friendList', keyword], // 친구 검색 -> 쿼리키에 keyword 포함
		queryFn: () => socialApi.searchFriend(keyword),
		enabled: !!keyword, // keyword가 있을 때만 쿼리 실행(빈 문자열이 아닐 때) + 변경될때마다 자동으로 쿼리가 재실행
	});

	return {
		searchMyFriend: searchMyFriend?.content,
		isLoadingMyFriend,
		isFetchingMyFriend,
		errorMyFriend,
	}; //data에 원하는 값 반환
};

export default useSearchFriend;
