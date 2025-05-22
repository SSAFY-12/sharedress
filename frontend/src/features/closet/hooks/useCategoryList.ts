import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/features/closet/api/closetApi';

export const useCategoryList = () =>
	useQuery({
		queryKey: ['categoryList'],
		queryFn: fetchCategories,
	});
