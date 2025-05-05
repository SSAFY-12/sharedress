import GoogleAuthPage from './GoogleAuthPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const LoginPage = () => {
	const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

	return (
		// 부모 높이를 전체로 설정
		<div className='min-h-screen p-6 flex flex-col items-center justify-center'>
			{/* 로고와 설명 */}
			<div className='flex flex-col items-center justify-center mb-8'>
				<h1 className='text-3xl font-bold mb-2 font-logo text-white'>
					쉐어드레스
				</h1>
				<p className='text-md font-logo text-white'>
					옷장 공유와 스타일 조언을 한번에
				</p>
			</div>

			{/* 로그인 버튼 */}
			<div className='w-full max-w-sm mt-8 rounded-lg flex justify-center items-center'>
				{/* google OAUTH 컴포넌트는 GoogleOAuthProvider 컴포넌트 안에 넣어야 함 */}
				<GoogleOAuthProvider clientId={clientId}>
					<GoogleAuthPage />
				</GoogleOAuthProvider>
			</div>
		</div>
	);
};
