import { LoginPage } from '@/features/auth/pages/LoginPage';

// Auth 관련 데이터 여기 넣으면 될 것 같음

const AuthPage = () => (
	// TODO: Add route handling logic here
	<div>
		{/* 모바일 레이아웃 */}
		<div className='block sm:hidden min-h-screen bg-auth-bg'>
			<LoginPage />
		</div>

		{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
		<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
			<div className='w-[390px] h-[844px] rounded-xl overflow-hidden shadow-xl bg-auth-bg'>
				<LoginPage />
			</div>
		</div>
	</div>
);

export default AuthPage;
