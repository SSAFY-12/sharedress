import { useQuery } from '@tanstack/react-query';
import { fetchCoordinationDetail } from '../api/myClosetApi';

export const useCoordinationDetail = (coordinationId: number) =>
	useQuery({
		queryKey: ['coordinationDetail', coordinationId],
		queryFn: () => fetchCoordinationDetail(coordinationId),
		enabled: !!coordinationId,
	});
