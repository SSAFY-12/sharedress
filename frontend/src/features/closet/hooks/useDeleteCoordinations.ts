import { useMutation } from '@tanstack/react-query';
import { deleteCoordination } from '../api/myClosetApi';

export const useDeleteCoordination = () =>
	useMutation({
		mutationFn: deleteCoordination,
	});
