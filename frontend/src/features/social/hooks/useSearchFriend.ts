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

// 두 가지 케이스가 필요한데
// 1. 내가 가지고 있는 친구 목록에서 검색
// 2. 뭐 전체 검색 & ID 찾기에서 친구 목록 검색 후 친구 추가

const useSearchFriend = (nickname: string) => {
	const {
		data: searchMyFriend,
		isLoading: isLoadingMyFriend,
		error: errorMyFriend,
	} = useQuery<SearchFriendResponse>({
		queryKey: ['searchFriend'], // 친구 검색
		queryFn: () => socialApi.searchFriend(nickname),
	});

	//searchAllFriend
	const {
		data: searchAllFriend,
		isLoading: isLoadingAllFriend,
		error: errorAllFriend,
	} = useQuery<SearchFriendResponse>({
		queryKey: ['searchFriend'], // 친구 검색
		queryFn: () => socialApi.searchFriend(nickname),
	});

	return {
		searchMyFriend,
		searchAllFriend,
		isLoadingMyFriend,
		isLoadingAllFriend,
		errorMyFriend,
		errorAllFriend,
	}; //data에 원하는 값 반환
};

export default useSearchFriend;
