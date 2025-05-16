import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCoordination } from '@/features/closet/api/closetApi';
import { useClosetStore } from '@/store/useClosetStore';

export const useDeleteCoordination = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCoordination,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['closet'] });
		},
	});
};
