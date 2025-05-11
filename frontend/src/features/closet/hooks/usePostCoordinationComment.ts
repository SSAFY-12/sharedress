import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCoordinationComment } from '@/features/closet/api/closetApi';

export const usePostCoordinationComment = (coordinationId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) =>
			postCoordinationComment({ coordinationId, content }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['coordinationComments', coordinationId],
			});
		},
	});
};
