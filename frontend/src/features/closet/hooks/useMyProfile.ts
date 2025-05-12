import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/features/closet/api/closetApi';
import { useProfileStore } from '@/store/useProfileStore';

export const useMyProfile = () => {
	const setMyId = useProfileStore((state) => state.setMyId);
	const setIsPublic = useProfileStore((state) => state.setIsPublic);

	return useQuery({
		queryKey: ['myProfile'],
		queryFn: async () => {
			const data = await getMyProfile();
			setMyId(data.id);
			setIsPublic(data.isPublic);
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
