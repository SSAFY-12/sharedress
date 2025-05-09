// hooks/useRegistCloth.ts
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LibraryApis, ClosetApis } from '@/features/regist/api/registApis';

export const useRegistCloth = (id: number) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: () => LibraryApis.registCloth(id),
		retry: false, // 409 재시도 금지
		onSuccess: () => {
			toast.success('옷을 등록했어요 👚');
			qc.invalidateQueries({ queryKey: ['closet'] });
		},
		onError: (err: any) => {
			// 409: 이미 등록된 옷
			if ('response' in err && err.response?.status === 409) {
				// 이 자리에서는 카드 컴포넌트 쪽에서 id를 받아야 하므로
				// 따로 setState 하지 않고, 컴포넌트 쪽 onError 콜백을 쓰세요.
				toast.info('이미 등록된 옷이에요 😉');
			} else {
				toast.error('옷 등록 실패 😥');
			}
		},
	});
};

export const useDeleteCloth = (id: number | undefined) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: () => {
			if (!id) {
				throw new Error('삭제할 옷의 ID가 없습니다.');
			}
			return ClosetApis.deleteCloth(id);
		},
		retry: false,
		onSuccess: () => {
			toast.success('옷을 삭제했어요 🗑️');
			qc.invalidateQueries({ queryKey: ['closet'] });
		},
		onError: (error) => {
			if (
				error instanceof Error &&
				error.message === '삭제할 옷의 ID가 없습니다.'
			) {
				return;
			}
			toast.error('삭제 실패 😥');
		},
	});
};
