import { useQuery } from '@tanstack/react-query';
import { fetchFriendProfile, Profile } from '@/features/closet/api/closetApi';

export const useFriendProfile = (memberId: number) =>
	useQuery<Profile>({
		queryKey: ['friendProfile', memberId],
		queryFn: () => fetchFriendProfile(memberId),
		enabled: !!memberId,
	});
