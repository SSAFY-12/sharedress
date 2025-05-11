import { useQuery } from '@tanstack/react-query';
import {
	CoordinationItem,
	fetchRecommendedToFriend,
} from '@/features/closet/api/closetApi';

export const useRecommendedToFriend = (memberId: number) =>
	useQuery<CoordinationItem[]>({
		queryKey: ['recommendedToFriend', memberId],
		queryFn: () => fetchRecommendedToFriend(memberId),
	});
