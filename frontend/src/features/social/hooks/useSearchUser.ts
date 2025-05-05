import { useQuery } from '@tanstack/react-query';
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

const useSearchUser = (nickname: string) => {
	const { data, isLoading, error } = useQuery<SearchUserResponse>({
		queryKey: ['searchUser', nickname],
		queryFn: () => socialApi.searchAllUser(nickname, 0, 10),
		enabled: !!nickname,
	});

	return {
		searchUser: data?.content, // 유저 검색 결과
		pagination: data?.pagination, // 유저 검색 페이지네이션
		isLoading,
		error,
	};
};

export default useSearchUser;
