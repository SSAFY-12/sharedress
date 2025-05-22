import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/features/closet/api/closetApi';
import { useProfileStore } from '@/store/useProfileStore';
import { useAuthStore } from '@/store/useAuthStore';

export const useMyProfile = () => {
	const setMyId = useProfileStore((state) => state.setMyId);
	const setIsPublic = useProfileStore((state) => state.setIsPublic);
	const setIsGuest = useAuthStore((state) => state.setIsGuest);
	const setNickname = useProfileStore((state) => state.setNickname);
	const setOneLiner = useProfileStore((state) => state.setOneLiner);

	return useQuery({
		queryKey: ['myProfile'],
		queryFn: async () => {
			const data = await getMyProfile();
			setMyId(data.id);
			setIsPublic(data.isPublic);
			setIsGuest(false);
			setNickname(data.nickname);
			setOneLiner(data.oneLiner);
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
