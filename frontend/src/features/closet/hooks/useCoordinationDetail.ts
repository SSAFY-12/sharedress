import { useQuery } from '@tanstack/react-query';
import { fetchCoordinationDetail } from '@/features/closet/api/closetApi';

export const useCoordinationDetail = (coordinationId: number) =>
	useQuery({
		queryKey: ['coordinationDetail', coordinationId],
		queryFn: () => fetchCoordinationDetail(coordinationId),
		enabled: !!coordinationId,
	});
