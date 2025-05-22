import fcmApi from '@/features/alert/api/fcmapi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	NotificationListRes,
	NotificationLeadReq,
	NotificationLeadRes,
} from '@/features/alert/types/alert';

const useNotification = () => {
	const { data, isLoading, error } = useQuery<NotificationListRes, Error>({
		queryKey: ['notification'],
		queryFn: () => fcmApi.getNotificationList(),
	});

	const queryClient = useQueryClient();
	const { mutate: readNotification } = useMutation<
		NotificationLeadRes,
		Error,
		NotificationLeadReq
	>({
		mutationFn: (notificationId: NotificationLeadReq) =>
			fcmApi.readNotification(notificationId.notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notification'] });
		},
	});

	return { data, isLoading, error, readNotification };
};

export default useNotification;
