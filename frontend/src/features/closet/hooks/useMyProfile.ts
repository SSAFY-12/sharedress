import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/features/closet/api/myClosetApi';
import { useProfileStore } from '@/store/useProfileStore';

export const useMyProfile = () => {
	const setMyId = useProfileStore((state) => state.setMyId);

	return useQuery({
		queryKey: ['myProfile'],
		queryFn: async () => {
			const data = await getMyProfile();
			setMyId(data.id);
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
