import { useQuery } from '@tanstack/react-query';
import { fetchClothDetail } from '@/features/closet/api/closetApi';

export const useClothDetail = (clothId: number) =>
	useQuery({
		queryKey: ['clothDetail', clothId],
		queryFn: () => fetchClothDetail(clothId),
		enabled: !!clothId,
	});
