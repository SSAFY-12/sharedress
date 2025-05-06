import { useQuery } from '@tanstack/react-query';
import { ClosetItem, fetchCloset } from '@/features/closet/api/myClosetApi';

export const useCloset = (memberId: number, categoryId?: number) =>
	useQuery<ClosetItem[]>({
		queryKey: ['closet', memberId, categoryId],
		queryFn: () => fetchCloset({ memberId, categoryId }),
	});
