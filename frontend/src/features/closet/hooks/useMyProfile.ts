import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/features/closet/api/myClosetApi';
import { useProfileStore } from '@/store/useProfileStore';

export const useMyProfile = () => {
	const setProfile = useProfileStore((state) => state.setProfile);
	return useQuery({
		queryKey: ['myProfile'],
		queryFn: async () => {
			const data = await getMyProfile();
			setProfile(data);
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
