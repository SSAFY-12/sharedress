import client from '@/api/client';

export const socialApi = {
	// 친구 목록 조회
	getFriendList: async () => {
		const response = await client.get('/api/friends');
		return response.data;
	},
	// 친구 검색
	searchFriend: async (nickname: string) => {
		const response = await client.get(
			`/api/friends/search?nickname=${nickname}`,
		);
		return response.data;
	},
	// 친구 요청
	requestFriend: async (receiverId: string, message: string) => {
		const response = await client.post(`/api/friends/request`, {
			receiverId,
			message,
		});
		return response.data;
	},
	// 친구 요청 수락
	acceptFriendRequest: async (requestId: string) => {
		const response = await client.post(
			`/api/friends/request/${requestId}/accept`,
		);
		return response.data;
	},
	// 친구 요청 거절
	rejectFriendRequest: async (requestId: string) => {
		const response = await client.post(
			`/api/friends/request/${requestId}/reject`,
		);
		return response.data;
	},
};
