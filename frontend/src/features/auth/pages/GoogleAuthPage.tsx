// import { useGoogleLogin } from '@react-oauth/google';
// import { useNavigate, useLocation } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface GoogleAuthPageProps {
	id?: string;
}
const GoogleAuthPage = ({ id }: GoogleAuthPageProps) => {
	const location = useLocation();
	// const navigate = useNavigate();

	// 리다이렉트 후 코드 처리
	useEffect(() => {
		// mutation.mutate();
		// URL에서 인증 코드 가져오기
		// const urlParams = new URLSearchParams({
		// 	response_type: 'token',
		// 	client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
		// 	redirect_uri: `http://localhost:5173/oauth/google/callback`,
		// 	scope: 'email profile openid',
		// }); // 파라미터 추출
		// // const code = urlParams.get('code'); // code의 파라미터 추출
		// console.log(urlParams.toString(), 'test');
		// mutation.mutate(urlParams.toString());
		// if (code) {
		// 	console.log('Authorization Code:', code);
		// 	mutation.mutate(code); //백엔드로 코드 전송
		// }
	}, [location]); //mutation??

	// const login = useGoogleLogin({
	// 	flow: 'implicit',
	// 	onSuccess: (codeResponse) => {
	// 		console.log(codeResponse, 'test');
	// 	},
	// 	// flow: 'auth-code',
	// 	onError: () => {
	// 		console.log('Login Failed');
	// 	},
	// 	ux_mode: 'redirect', // 모바일 환경에서 redirect 사용 많음
	// 	// 여기 백엔드 주소
	// 	redirect_uri: `http://localhost:5173/oauth/google/callback`, // 콜백 URL 지정
	// });

	const handleLogin = async () => {
		const params = new URLSearchParams({
			response_type: 'token',
			client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
			redirect_uri: `https://www.sharedress.co.kr/oauth/google/callback`,
			// redirect_uri: `https://localhost:5173/oauth/google/callback`,

			scope: 'openid profile email',
		});
		// console.log(params.toString(), 'test');
		// mutation.mutate(params.toString());
		window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
	};

	return (
		// btn 커스터마이징
		<button
			onClick={() => handleLogin()}
			className='flex items-center gap-2.5 px-10 py-2.5 bg-white border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 text-base font-bold shadow-sm'
			id={id}
		>
			<img
				src='https://developers.google.com/identity/images/g-logo.png'
				alt='Google logo'
				className='w-[18px] h-[18px]'
			/>
			구글로 시작하기
		</button>
	);
};

export default GoogleAuthPage;
