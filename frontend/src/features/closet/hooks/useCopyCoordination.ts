import { useMutation } from '@tanstack/react-query';
import { postCopyCoordination } from '@/features/closet/api/myClosetApi';

export const useCopyCoordination = () =>
	useMutation({
		mutationFn: postCopyCoordination,
	});
