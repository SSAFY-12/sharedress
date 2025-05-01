import { useGoogleLogin } from '@react-oauth/google';

const GoogleAuthPage = () => {
	const login = useGoogleLogin({
		onSuccess: (response) => {
			// 승인 코드 플로우
			if ('code' in response) {
				console.log('Authorization Code:', response.code);
				// TODO: 이 코드를 백엔드로 전송하여 액세스 토큰으로 교환
			}
		},
		onError: () => {
			console.log('Login Failed');
		},
		flow: 'auth-code',
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
