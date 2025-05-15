import { useQuery } from '@tanstack/react-query';
import { ClosetApis } from '@/features/regist/api/registApis';
import { useClosetStore, MyClosetContent } from '@/store/useClosetStore';

export const useGetCloth = () => {
	const setCloset = useClosetStore((state) => state.setCloset);

	return useQuery({
		queryKey: ['myCloset'],
		queryFn: async () => {
			const response = await ClosetApis.getMyCloset();
			// 옷장 ID와 라이브러리 ID를 매핑하여 store에 저장
			const closetItems: MyClosetContent[] = response.content.map(
				(item: MyClosetContent) => ({
					closetId: item.closetId,
					libraryId: item.libraryId,
				}),
			);
			setCloset(closetItems);
			return response.content;
		},
	});
};
