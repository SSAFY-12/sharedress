import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LibraryApis } from '@/features/regist/api/registApis';
import { useClosetStore } from '@/store/useClosetStore';
import { toast, Icons } from 'react-toastify';

export const useRegistCloth = (id: number) => {
	const qc = useQueryClient();
	const addCloset = useClosetStore((state) => state.addCloset);

	return useMutation({
		mutationFn: async () => {
			const response = await LibraryApis.registCloth(id);
			return response;
		},
		retry: false,
		onSuccess: async (response) => {
			addCloset({ id: response.content, libraryId: id });
			qc.invalidateQueries({ queryKey: ['closet'] });
			toast.success('옷장에 추가되었습니다!', {
				icon: Icons.success,
			});
		},
		onError: async (error: any) => {
			toast.error('옷장 추가에 실패했습니다.', {
				icon: Icons.error,
			});
		},
	});
};

export const useDeleteCloth = (id: number | undefined) => {
	const qc = useQueryClient();
	const removeCloset = useClosetStore((state) => state.removeCloset);

	return useMutation({
		mutationFn: () => {
			if (!id) {
				throw new Error('삭제할 옷의 ID가 없습니다.');
			}
			return LibraryApis.deleteCloth(id);
		},
		retry: false,
		onSuccess: async () => {
			removeCloset(id ?? 0);
			qc.invalidateQueries({ queryKey: ['closet'] });
			toast.success('옷장에서 삭제되었습니다!');
		},
		onError: async (error: any) => {
			if (error?.response?.status === 404) {
				return;
			}
			toast.error('옷장 삭제에 실패했습니다.', {
				icon: Icons.error,
			});
		},
	});
};
