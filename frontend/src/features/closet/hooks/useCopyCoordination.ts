import { useMutation } from '@tanstack/react-query';
import { postCopyCoordination } from '../api/myClosetApi';

export const useCopyCoordination = () =>
	useMutation({
		mutationFn: postCopyCoordination,
	});
