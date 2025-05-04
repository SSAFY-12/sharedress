import { socialApi } from '../api/socialApi';
import { useQuery } from '@tanstack/react-query';
import { FriendList } from '../types/social';

interface FriendListResponse {
	//실제 데이터 응답구조
	status: {
		code: string;
		message: string;
	};
	content: FriendList['content']; //실제 데이터 응답구조 -> 키 값
}

const useFriendList = () => { 
	const { data, isLoading, error } = useQuery<FriendListResponse>({
		queryKey: ['friendList'], // 친구 목록리스트
		queryFn: () => socialApi.getFriendList(), // 쿼리 함수
	});
	return { data: data?.content, isLoading, error }; //data에 원하는 값 반환
};

export default useFriendList;
