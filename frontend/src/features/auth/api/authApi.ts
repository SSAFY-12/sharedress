import { client } from '@/api/client';
// import client from '@/api/client';
import { TokenResponse } from '@/features/auth/types/auth';

// axios의 기본 구조 -> data, status : 상태코드, statusText : 상태정보, headers, config, request
export const authApi = {
	// --------------------로그인 ------------------------
	login: async (accessToken: string) => {
		console.log('🔑 Login request - Current cookies:', document.cookie); // 현재 쿠키 상태
		const response = await client.post(
			`/api/auth/google`,
			{
				accessToken: accessToken,
			},
			{
				withCredentials: true, // 기본 설정 : withCredentials: true
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		// 응답 헤더에서 Set-Cookie 확인
		// 서버로 받은 응답에서 쿠키 설정이 제대로 되었는지 확인하는 디버깅 코드드
		const setCookie = response.headers['set-cookie']; // 응답 헤더에서 Set-Cookie 확인
		console.log('🍪 Login response headers:', {
			setCookie, // 응답 헤더에서 Set-Cookie 확인 === undefined면 서버가 쿠키를 설정하지 않았음을 난타냄
			headers: response.headers, // 응답 헤더
			protocol: window.location.protocol, // 프로토콜 === https인지 확인, 쿠키는 https에서만 전달됨
			hostname: window.location.hostname, // 호스트명 === localhost인지 확인, 쿠키는 localhost에서만 전달됨
		});

		// 쿠키가 설정되었는지 확인
		const cookies = document.cookie; // 현재 쿠키 상태
		console.log('✅ Login response - New cookies:', {
			cookies, // 현재 쿠키 상태
			hasCookies: !!cookies, // 쿠키가 존재하는지 확인
			time: new Date().toLocaleString('ko-KR'), // 현재 시간
		});

		return response.data;
	},

	// -------------------- 리프레시 ------------------------//
	refresh: async () => {
		const cookies = document.cookie; // 현재 쿠키 상태
		console.log('🔄 Refresh token request:', {
			시간: new Date().toLocaleString('ko-KR'),
			쿠키: cookies, // 현재 쿠키 상태
			withCredentials: client.defaults.withCredentials, // 기본 설정 : withCredentials: true
			// 크로스 도메인 요청에서 쿠키 전달 여부
			쿠키존재: !!cookies, // 쿠키가 존재하는지 확인
		});

		const response = await client.post<TokenResponse>(
			'/api/auth/refresh',
			null,
			{
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		// 응답 헤더에서 Set-Cookie 확인
		const setCookie = response.headers['set-cookie'];
		console.log('🍪 Refresh response headers:', {
			setCookie,
			headers: response.headers,
		});

		console.log('✅ Refresh token response:', {
			시간: new Date().toLocaleString('ko-KR'),
			쿠키: document.cookie,
		});

		return response.data;
	},
};
