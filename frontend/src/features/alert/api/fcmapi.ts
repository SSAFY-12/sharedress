import { client } from '@/api/client';
import {
	NotificationListRes,
	NotificationLeadRes,
} from '@/features/alert/types/alert';

const fcmApi = {
	saveFcmToken: async (token: string) => {
		const response = await client.post('/api/members/fcm-token', {
			fcmToken: token,
		});
		return response.data;
	},

	getNotificationList: async (): Promise<NotificationListRes> => {
		const response = await client.get('/api/notifications');
		return response.data;
	},

	readNotification: async (
		notificationId: number,
	): Promise<NotificationLeadRes> => {
		const response = await client.patch(`/api/notifications/${notificationId}`);
		return response.data;
	},
};

const AlertApi = {
	getUnreadNotificationStatus: async (): Promise<{
		hasUnreadNotification: boolean;
	}> => {
		const response = await client.get('/api/notifications/unread');
		return response.data.content;
	},
};

export { AlertApi };
export default fcmApi;
