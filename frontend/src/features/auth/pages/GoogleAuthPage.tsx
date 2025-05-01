import { useGoogleLogin } from '@react-oauth/google';
// import { useNavigate, useLocation } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '@/features/auth/hooks/useAuth';

const GoogleAuthPage = () => {
	const location = useLocation();
	const { mutation } = useAuth();
	// const navigate = useNavigate();

	// 리다이렉트 후 코드 처리
	useEffect(() => {
		// URL에서 인증 코드 가져오기
		const urlParams = new URLSearchParams(location.search); // 파라미터 추출
		const code = urlParams.get('code'); // code의 파라미터 추출

		if (code) {
			console.log('Authorization Code:', code);
			mutation.mutate(code); //백엔드로 코드 전송
		}
	}, [location, mutation]); //mutation??

	const login = useGoogleLogin({
		flow: 'auth-code',
		onError: () => {
			console.log('Login Failed');
		},
		ux_mode: 'redirect', // 모바일 환경에서 redirect 사용 많음
		redirect_uri: `https://localhost:5173/auth/google/callback`, // 콜백 URL 지정
	});

	return (
		// btn 커스터마이징
		<button
			onClick={() => login()}
			className='flex items-center gap-2.5 px-10 py-2.5 bg-white border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 text-base font-bold shadow-sm'
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
