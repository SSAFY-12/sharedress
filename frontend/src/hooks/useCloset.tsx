import { useQuery } from '@tanstack/react-query';
import { ClosetItem, fetchCloset } from '@/features/regist/api/closetApis';

export const useMyCloset = (memberId: number, categoryId?: number) =>
	useQuery<ClosetItem[]>({
		queryKey: ['closet', memberId, categoryId],
		queryFn: () => fetchCloset({ memberId, categoryId }),
	});
