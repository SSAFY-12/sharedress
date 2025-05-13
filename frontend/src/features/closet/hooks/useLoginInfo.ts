import { useQuery } from '@tanstack/react-query';
import { getMyLoginInfo } from '../api/closetApi';

export const useLoginInfo = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['loginInfo'],
		queryFn: () => getMyLoginInfo(),
	});

	return { data, isLoading, error };
};
