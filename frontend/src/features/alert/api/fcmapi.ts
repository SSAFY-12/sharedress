import { client } from '@/api/client';

const fcmApi = {
	getFcmToken: async () => {
		const response = await client.get('/api/members/fcm-token');
		return response.data;
	},
};

export default fcmApi;
