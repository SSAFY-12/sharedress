import { useMutation } from '@tanstack/react-query';
import { deleteCoordination } from '@/features/closet/api/myClosetApi';

export const useDeleteCoordination = () =>
	useMutation({
		mutationFn: deleteCoordination,
	});
