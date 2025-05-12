import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/closetApi';

export const useCategoryList = () =>
	useQuery({
		queryKey: ['categoryList'],
		queryFn: fetchCategories,
	});
