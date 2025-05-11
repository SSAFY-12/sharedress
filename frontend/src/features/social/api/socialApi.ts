import client from '@/api/client';

export const socialApi = {
	// 친구 목록 조회
	getFriendList: async () => {
		const response = await client.get('/api/friends');
		return response.data;
	},
	// 친구 요청 목록 조회
	getFriendRequestList: async () => {
		const response = await client.get('/api/friends/request');
		return response.data;
	},

	// 친구 검색
	searchFriend: async (keyword: string) => {
		const response = await client.get(`/api/friends/search?keyword=${keyword}`);
		return response.data;
	},
	// 전체 사용자 검색
	searchAllUser: async (keyword: string, cursor?: number, size?: number) => {
		let url = `/api/members/search?keyword=${keyword}`;
		if (cursor !== undefined && cursor !== null) {
			url += `&cursor=${cursor}`;
		}
		if (size !== undefined) {
			url += `&size=${size}`;
		}
		const response = await client.get(url);
		return response.data;
	},

	// 전체 사용자 -> 친구 요청
	requestFriend: async (receiverId: number, message: string) => {
		const response = await client.post(`/api/friends/request`, {
			receiverId,
			message,
		});
		return response.data;
	},

	// 특정 친구 요청 조회
	getFriendRequest: async (memberId: number) => {
		const response = await client.get(`/api/friends/${memberId}/request`);
		return response.data;
	},

	//  전체 사용자 -> 친구 요청 수락
	acceptFriendRequest: async (requestId: number) => {
		const response = await client.post(
			`/api/friends/request/${requestId}/accept`,
		);
		return response.data;
	},
	//  전체 사용자 -> 친구 요청 거절
	rejectFriendRequest: async (requestId: number) => {
		const response = await client.post(
			`/api/friends/request/${requestId}/reject`,
		);
		return response.data;
	},
	// 전체 사용자 ->  친구 요청 취소
	cancelFriendRequest: async (requestId: number) => {
		const response = await client.post(
			`/api/friends/request/${requestId}/cancel`,
		);
		return response.data;
	},

	// 친구코디 요청
	requestFriendCodi: async (receiverId: number, message: string) => {
		const response = await client.post(`/api/coordinations/request`, {
			receiverId,
			message,
		});
		return response.data;
	},
};

export const publicApi = {
	// 공개링크 발급
	createPublicLink: async () => {
		const response = await client.post('/api/open-link');
		return response.data.content.openLink;
	},

	// 공개링크 디코딩
	decodePublicLink: async (openLink: string) => {
		const response = await client.get(`/api/open-link/${openLink}`);
		return response.data;
	},
};
