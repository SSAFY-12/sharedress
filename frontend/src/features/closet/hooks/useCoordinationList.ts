import { useQuery } from '@tanstack/react-query';
import { CoordinationScope, getCoordinationList } from '../api/myClosetApi';

export const useCoordinationList = (
	memberId: number,
	scope: CoordinationScope,
) =>
	useQuery({
		queryKey: ['coordinationList', memberId, scope],
		queryFn: () => getCoordinationList(memberId, scope),
		enabled: !!memberId,
	});
