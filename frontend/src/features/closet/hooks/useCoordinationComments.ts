import { useQuery } from '@tanstack/react-query';
import { fetchCoordinationComments } from '../api/myClosetApi';

export const useCoordinationComments = (coordinationId: number) =>
	useQuery({
		queryKey: ['coordinationComments', coordinationId],
		queryFn: () => fetchCoordinationComments(coordinationId),
		enabled: !!coordinationId,
	});
