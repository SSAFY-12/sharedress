import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCoordination } from '@/features/closet/api/closetApi';

export const useDeleteCoordination = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCoordination,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['closet'] });
		},
	});
};
