import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { profileModifyApi } from '@/features/social/api/socialApi';

export const useModifyProfileImage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (image: File) => profileModifyApi.modifyProfileImage(image),
		onMutate: async (newImage) => {
			const previousImage = queryClient.getQueryData(['myProfile']);
			queryClient.setQueryData(['myProfile'], newImage);
			return { previousImage };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['myProfile'] });
		},
		onError: (error, _, context) => {
			if (context?.previousImage) {
				queryClient.setQueryData(['myProfile'], context.previousImage);
				queryClient.invalidateQueries({ queryKey: ['myProfile'] });
			}
			console.error('프로필 이미지 수정 실패:', error);
		},
	});
};
