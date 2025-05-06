import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/features/closet/api/myClosetApi';

export const useMyProfile = () =>
	useQuery({
		queryKey: ['myProfile'],
		queryFn: getMyProfile,
	});
