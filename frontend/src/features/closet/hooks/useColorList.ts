import { useQuery } from '@tanstack/react-query';
import { fetchColors } from '@/features/closet/api/closetApi';

export const useColorList = () =>
	useQuery({
		queryKey: ['colorList'],
		queryFn: () => fetchColors(),
	});
