import { useMutation } from '@tanstack/react-query';
import { deleteCoordination } from '@/features/closet/api/closetApi';

export const useDeleteCoordination = () =>
	useMutation({
		mutationFn: deleteCoordination,
	});
