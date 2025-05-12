import { useQuery } from '@tanstack/react-query';
import { fetchColors } from '../api/closetApi';

export const useColorList = () =>
	useQuery({
		queryKey: ['colorList'],
		queryFn: () => fetchColors(),
	});
