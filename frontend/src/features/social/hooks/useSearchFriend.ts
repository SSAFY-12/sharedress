import { socialApi } from '../api/socialApi';
import { useQuery } from '@tanstack/react-query';
import { SearchFriend } from '../types/social';

interface SearchFriendResponse {
	//실제 데이터 응답구조
	status: {
		code: string;
		message: string;
	};
	content: SearchFriend['comments']; //실제 데이터 응답구조 -> 키 값
}

const useSearchFriend = (nickname: string) => {
	const { data, isLoading, error } = useQuery<SearchFriendResponse>({
		queryKey: ['searchFriend'], // 친구 검색
		queryFn: () => socialApi.searchFriend(nickname),
	});
	return { data: data?.content, isLoading, error }; //data에 원하는 값 반환
};

export default useSearchFriend;
