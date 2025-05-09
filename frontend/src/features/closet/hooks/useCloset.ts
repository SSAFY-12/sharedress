import { useQuery } from '@tanstack/react-query';
import { ClosetItem, fetchCloset } from '@/features/closet/api/myClosetApi';
import { useClosetStore } from '@/store/useClosetStore';

export const useCloset = (memberId: number, categoryId?: number) => {
	const setCloset = useClosetStore((state) => state.setCloset);

	return useQuery<ClosetItem[]>({
		queryKey: ['closet', memberId, categoryId],
		queryFn: async () => {
			const data = await fetchCloset({ memberId, categoryId });
			// 비동기로 주스탄드에 업데이트
			Promise.resolve().then(() => {
				setCloset(
					data.map((item) => ({
						closetId: item.id,
						libraryId: item.libraryId,
					})),
				);
			});
			return data;
		},
	});
};
