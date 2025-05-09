import { useMutation } from '@tanstack/react-query';
import { deleteCloth } from '@/features/closet/api/myClosetApi';

export const useDeleteCloth = () =>
	useMutation({
		mutationFn: deleteCloth,
	});
