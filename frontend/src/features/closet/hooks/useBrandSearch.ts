import { useQuery } from '@tanstack/react-query';
import { fetchBrandsByKeyword } from '@/features/closet/api/closetApi';

export const useBrandSearch = (keyword: string) =>
	useQuery({
		queryKey: ['brandSearch', keyword],
		queryFn: () => fetchBrandsByKeyword(keyword),
		enabled: !!keyword.trim(),
	});
