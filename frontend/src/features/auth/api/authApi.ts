import { client } from '@/api/client';
// import client from '@/api/client';

// axios의 기본 구조 -> data, status : 상태코드, statusText : 상태정보, headers, config, request
export const authApi = {
	// --------------------로그인 ------------------------
	login: async (accessToken: string) => {
		//url코드
		//OAuth 인증 토큰 -> token이 있을때만 들어갈 것이기 때문에
		const response = await client.post(`/api/auth/google`, {
			//axios자체를 활용했으니까
			accessToken: accessToken,
		});
		return response.data;
	},

	// -------------------- 리프레시 ------------------------//
	refresh: async () => {
		const response = await client.post(`/api/auth/refresh`);
		return response.data;
	},
};
