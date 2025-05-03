import { LoginPage } from '@/features/auth/pages/LoginPage';
import { motion, Variants } from 'framer-motion';

// Auth 관련 데이터 여기 넣으면 될 것 같음

const AuthPage = () => {
	const backgroundVariants: Variants = {
		initial: {
			x: -25,
			scale: 1.1,
		},
		animate: {
			x: 0,
			scale: 1.1,
			transition: {
				duration: 2.5,
				ease: 'easeOut',
			},
		},
	};

	return (
		<div>
			{/* 모바일 레이아웃 */}
			<div className='block sm:hidden min-h-screen relative overflow-hidden'>
				<motion.div
					className='absolute inset-0 bg-auth-bg'
					initial='initial'
					animate='animate'
					variants={backgroundVariants}
				/>
				{/* 어두운 오버레이 */}
				<div className='absolute inset-0 bg-black/30'></div>
				{/* 컨텐츠 */}
				<div className='relative z-10'>
					<LoginPage />
				</div>
			</div>

			{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
			<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
				<div className='w-[390px] h-[844px] rounded-xl overflow-hidden shadow-xl relative'>
					<motion.div
						className='absolute inset-0 bg-auth-bg'
						initial='initial'
						animate='animate'
						variants={backgroundVariants}
					/>
					{/* 어두운 오버레이 */}
					<div className='absolute inset-0 bg-black/30'></div>
					{/* 컨텐츠 */}
					<div className='relative z-10'>
						<LoginPage />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
