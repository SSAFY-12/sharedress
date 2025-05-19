import { useQuery } from '@tanstack/react-query';
import { fetchCoordinationComments } from '@/features/closet/api/closetApi';

export const useCoordinationComments = (coordinationId: number) =>
	useQuery({
		queryKey: ['coordinationComments', coordinationId],
		queryFn: () => fetchCoordinationComments(coordinationId),
		enabled: !!coordinationId,
		retry: false,
	});
