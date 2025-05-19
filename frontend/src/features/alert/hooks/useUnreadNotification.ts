import { useQuery } from '@tanstack/react-query';
import { AlertApi } from '@/features/alert/api/fcmapi';

export const useUnreadNotification = () => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['unreadNotification'],
		queryFn: AlertApi.getUnreadNotificationStatus,
		refetchInterval: 30000, // 30초마다 자동으로 상태 업데이트
		staleTime: 10000, // 10초 동안 캐시된 데이터 사용
	});

	return {
		hasUnreadNotification: data?.hasUnreadNotification ?? false,
		isLoading,
		error,
		refetch,
	};
};

export default useUnreadNotification;
