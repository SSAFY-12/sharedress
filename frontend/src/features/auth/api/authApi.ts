import { client } from '@/api/client';
import { TokenResponse } from '@/features/auth/types/auth';

// axios의 기본 구조 -> data, status : 상태코드, statusText : 상태정보, headers, config, request
export const authApi = {
	// --------------------로그인 ------------------------
	login: async (accessToken: string) => {
		const response = await client.post(
			`/api/auth/google`,
			{
				accessToken: accessToken,
			},
			{
				withCredentials: true, // 쿠키 전송 허용
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		return response.data;
	},

	// -------------------- 리프레시 ------------------------//
	refresh: async () => {
		const response = await client.post<TokenResponse>(
			'/api/auth/refresh',
			null, // 요청 본문 없음
			{
				withCredentials: true, // 쿠키 전송 허용
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		return response.data;
	},

	logout: async () => {
		try {
			await client.delete('/api/auth/logout');
		} catch (error) {
			console.error('로그아웃 실패', error);
		}
	},
};
