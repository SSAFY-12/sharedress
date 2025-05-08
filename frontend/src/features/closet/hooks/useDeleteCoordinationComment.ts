import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCoordinationComment } from '../api/myClosetApi';

export const useDeleteCoordinationComment = (coordinationId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (commentId: number) =>
			deleteCoordinationComment({ coordinationId, commentId }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['coordinationComments', coordinationId],
			});
		},
	});
};
