import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCloth } from '@/features/closet/api/closetApi';

export const useDeleteCloth = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCloth,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['closet'] });
		},
	});
};
