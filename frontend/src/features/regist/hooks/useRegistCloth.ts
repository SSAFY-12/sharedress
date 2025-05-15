import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LibraryApis, ClosetApis } from '@/features/regist/api/registApis';

export const useRegistCloth = (id: number) => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: () => LibraryApis.registCloth(id),
		retry: false, // 409 재시도 금지
		onSuccess: async () => {
			if ('serviceWorker' in navigator && 'Notification' in window) {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification('옷을 등록했어요 👚', {
					body: '옷을 등록했어요 👚',
					icon: '/android-chrome-192x192.png',
					badge: '/favicon-32x32.png',
				});
			}
			qc.invalidateQueries({ queryKey: ['closet'] });
		},
		onError: async (error: any) => {
			if (error?.response?.status === 409) {
				if ('serviceWorker' in navigator && 'Notification' in window) {
					const registration = await navigator.serviceWorker.ready;
					await registration.showNotification('옷 등록', {
						body: '이미 등록된 옷이에요 😉',
						icon: '/android-chrome-192x192.png',
						badge: '/favicon-32x32.png',
					});
				}
			} else {
				if ('serviceWorker' in navigator && 'Notification' in window) {
					const registration = await navigator.serviceWorker.ready;
					await registration.showNotification('옷 등록 실패', {
						body: '옷 등록 실패 😥',
						icon: '/android-chrome-192x192.png',
						badge: '/favicon-32x32.png',
					});
				}
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
		onSuccess: async () => {
			if ('serviceWorker' in navigator && 'Notification' in window) {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification('옷 삭제', {
					body: '옷을 삭제했어요 🗑️',
					icon: '/android-chrome-192x192.png',
					badge: '/favicon-32x32.png',
				});
			}
			qc.invalidateQueries({ queryKey: ['closet'] });
		},
		onError: async (error: any) => {
			if (error?.response?.status === 404) {
				return;
			}
			if ('serviceWorker' in navigator && 'Notification' in window) {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification('옷 삭제 실패', {
					body: '삭제 실패 😥',
					icon: '/android-chrome-192x192.png',
					badge: '/favicon-32x32.png',
				});
			}
		},
	});
};
