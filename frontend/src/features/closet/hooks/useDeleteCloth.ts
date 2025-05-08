import { useMutation } from '@tanstack/react-query';
import { deleteCloth } from '../api/myClosetApi';

export const useDeleteCloth = () =>
	useMutation({
		mutationFn: deleteCloth,
	});
