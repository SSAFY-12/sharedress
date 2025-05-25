import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { WebLayout } from '@/components/layouts/WebLayout';
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { Slide, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import useFcmStore from '@/store/useFcmStore';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { useNavigate } from 'react-router-dom';
import { AlertModal } from '@/components/modals/fcm-modal/AlertModal';
import PolingProviderMusinsa from '@/components/poling/PolingProviderMusinsa';
import PolingProviderCamera from '@/components/poling/PolingProviderCamera';
import { useScanStore } from '@/store/useScanStore';
import { useCameraStore } from './store/useCameraStore';
import useFcmInitialization from '@/features/alert/hooks/useFcmInitialization';
import PolingProvider29cm from './components/poling/PolingProvider29cm';

export const App = () => {
	useFcmInitialization();

	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const [showFcmModal, setShowFcmModal] = useState(false);
	const isGuest = useAuthStore((state) => state.isGuest);
	const isCameraScan = useCameraStore((state) => state.camera.isScan);
	const isMusinsaScan = useScanStore((state) => state.musinsa.isScan);
	const isCm29Scan = useScanStore((state) => state.cm29.isScan);

	useEffect(() => {
		const hideFcmAlert = localStorage.getItem('hideFcmAlert');
		if (!hideFcmAlert && !useFcmStore.getState().token) {
			setShowFcmModal(true);
		}
	}, [navigate]);
	// 토큰 유효성 검사 Hook은 항상 최상위에서 호출

	// 앱 시작 시 토큰 초기화
	useEffect(() => {
		const init = async () => {
			await initializeAuth();
			setIsLoading(false);
		};
		init();
	}, [initializeAuth]);

	if (isLoading || !isInitialized) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<GoogleAnalytics />

			{/* 모바일 레이아웃 */}
			<div className='block sm:hidden min-h-screen bg-white'>
				<MobileLayout />
			</div>

			{/* 웹 레이아웃 - 모바일 에뮬레이션 */}
			<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
				<div className='w-[560px] h-screen bg-white rounded-xl overflow-hidden shadow-xl'>
					<div className='relative h-full flex flex-col'>
						<WebLayout />
					</div>
				</div>
			</div>

			{/* Toastify 컨테이너 */}
			<ToastContainer
				className='py-6 px-4'
				toastClassName='py-2 rounded-xl bg-black bg-opacity-50 text-white text-description mb-2'
				position='top-center'
				transition={Slide}
				autoClose={1500}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
				toastStyle={{
					height: 'fit-content',
					minHeight: 'unset',
					padding: '16px 16px',
					display: 'flex',
					alignItems: 'center',
				}}
				closeButton={({ closeToast }) => (
					<button
						onClick={closeToast}
						style={{
							position: 'absolute',
							right: '16px',
							color: 'white',
							opacity: 0.5,
							fontSize: '14px',
							padding: '0',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							width: '20px',
							height: '20px',
						}}
					>
						×
					</button>
				)}
			/>

			{!isGuest && (
				<AlertModal
					isOpen={showFcmModal}
					onClose={() => setShowFcmModal(false)}
					onConfirm={() => {
						setShowFcmModal(false);
						navigate('/setting');
					}}
					onHide={() => {
						localStorage.setItem('hideFcmAlert', 'true');
						setShowFcmModal(false);
					}}
				/>
			)}
			{/* PolingProvider를 조건부로 렌더링 */}
			{isMusinsaScan ? <PolingProviderMusinsa /> : null}
			{isCameraScan ? <PolingProviderCamera /> : null}
			{/* 29cm 구매내역 스캔 프로바이더 */}
			{isCm29Scan ? <PolingProvider29cm /> : null}
		</>
	);
};

export default App;
