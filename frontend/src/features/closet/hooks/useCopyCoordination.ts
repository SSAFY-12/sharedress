import { useMutation } from '@tanstack/react-query';
import { postCopyCoordination } from '@/features/closet/api/closetApi';

export const useCopyCoordination = () =>
	useMutation({
		mutationFn: postCopyCoordination,
	});
