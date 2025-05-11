import { useMutation } from '@tanstack/react-query';
import { deleteCloth } from '@/features/closet/api/closetApi';

export const useDeleteCloth = () =>
	useMutation({
		mutationFn: deleteCloth,
	});
