import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/myClosetApi';

export const useMyProfile = () =>
	useQuery({
		queryKey: ['myProfile'],
		queryFn: getMyProfile,
	});
