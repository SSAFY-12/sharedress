import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuthPage = () => {
	const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

	// 들어오는 데이터 입력값
	// {
	//     clientId : ""
	//     credential: ""
	//     select_by: ""
	//     }

	// 커스텀 로그인 버튼 -> 사용자 정의 로그인 버튼

	return (
		<GoogleOAuthProvider clientId={`${clientId}`}>
			{/* 팝업 모드 사용시 빈 창 문제가 발생하지 않도록 Cross Origin Opener Poilcy 설정 */}
			<GoogleLogin
				// 성공
				onSuccess={(credentialResponse) => {
					console.log(credentialResponse);
				}}
				// 실패
				onError={() => {
					console.log('Login Failed');
				}}
			/>
			;
		</GoogleOAuthProvider>
	);
};

export default GoogleAuthPage;
