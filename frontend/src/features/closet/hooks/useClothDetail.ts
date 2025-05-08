import { useQuery } from '@tanstack/react-query';
import { fetchClothDetail } from '../api/myClosetApi';

export const useClothDetail = (clothId: number) =>
	useQuery({
		queryKey: ['clothDetail', clothId],
		queryFn: () => fetchClothDetail(clothId),
		enabled: !!clothId,
	});
