import { client } from '@/api/client';
// import client from '@/api/client';

// axios의 기본 구조 -> data, status : 상태코드, statusText : 상태정보, headers, config, request
export const authApi = {
	// --------------------로그인 ------------------------
	login: async (accessToken: string) => {
		console.log('🔑 Login request - Current cookies:', document.cookie);
		const response = await client.post(
			`/api/auth/google`,
			{
				accessToken: accessToken,
			},
			{
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		console.log('✅ Login response - New cookies:', document.cookie);
		return response.data;
	},

	// -------------------- 리프레시 ------------------------//
	refresh: async () => {
		console.log('🔄 Refresh token request - Current cookies:', document.cookie);
		const response = await client.post(
			`/api/auth/refresh`,
			{},
			{
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		console.log('✅ Refresh token response - New cookies:', document.cookie);
		return response.data;
	},
};
