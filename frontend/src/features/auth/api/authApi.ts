// import { client } from '@/api/client';
// import client from '@/api/client';
import axios from 'axios';
// client에서 데려와서 사용해도 되는게 맞나? -> 여기서 token 자체를 로그인하면 -> 자체적으로 계속들고있게 되는건가..?
// zustand에 저장하고, localstorage는 취약점이니,, indexDb에 넣어도 취약한거 아닌지? 이거 보안적으로 어떻게 해야할까?

// axios의 기본 구조 -> data, status : 상태코드, statusText : 상태정보, headers, config, request

export const authApi = {
	//login
	login: async (code: string) => {
		//url코드
		//OAuth 인증 토큰
		const response = await axios.post('/api/auth/google', {
			//axios자체를 활용했으니까
			code,
		});
		return response.data;
	},
};
