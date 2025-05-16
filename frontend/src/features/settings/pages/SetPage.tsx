import { useState, useEffect } from 'react';
import {
	ChevronRight,
	Bell,
	LogOut,
	Download,
	Info,
	Smartphone,
} from 'lucide-react';
import { InstallGuideModal } from '@/features/settings/components/InstallGuideModal';
import { MainModal } from '@/components/modals/main-modal';
import { SwitchToggle } from '@/components/buttons/switch-toggle';
import { requestNotificationPermission } from '@/utils/firebase';
import useFcmStore from '@/store/useFcmStore';
import fcmApi from '@/features/alert/api/fcmapi';
import useAuth from '@/features/auth/hooks/useAuth';
// PWA 설치 이벤트를 저장할 변수
let deferredPrompt: any = null;

export const SetPage = () => {
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const [notificationLocked, setNotificationLocked] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isIosGuideModalOpen, setIsIosGuideModalOpen] = useState(false);
	const [isAndroidGuideModalOpen, setIsAndroidGuideModalOpen] = useState(false);
	const { logout } = useAuth();

	// PWA 설치 이벤트 감지
	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			// 기본 동작 방지
			e.preventDefault();
			// 이벤트 저장
			deferredPrompt = e;
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt,
			);
		};
	}, []);

	// 알림 스위치 토글 핸들러
	const handleNotificationToggle = async () => {
		if (notificationsEnabled || notificationLocked) return;
		// FCM 권한 요청 및 토큰 저장
		const token = await requestNotificationPermission();
		if (token) {
			try {
				await fcmApi.saveFcmToken(token);
				useFcmStore.getState().setToken(token);
				setNotificationsEnabled(true);
				setNotificationLocked(true);
				// serviceWorker로 알림 안내
				if ('serviceWorker' in navigator && 'Notification' in window) {
					const registration = await navigator.serviceWorker.ready;
					await registration.showNotification('알림 안내', {
						body: '알림이 활성화되었습니다!',
						icon: '/android-chrome-192x192.png',
						badge: '/favicon-32x32.png',
					});
				}
			} catch (error) {
				// 실패 시 안내
				if ('serviceWorker' in navigator && 'Notification' in window) {
					const registration = await navigator.serviceWorker.ready;
					await registration.showNotification('알림 안내', {
						body: '알림 토큰 저장에 실패했습니다.',
						icon: '/android-chrome-192x192.png',
						badge: '/favicon-32x32.png',
					});
				}
			}
		} else {
			// 권한 거부 시 안내
			if ('serviceWorker' in navigator && 'Notification' in window) {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification('알림 안내', {
					body: '브라우저 알림 권한이 허용되지 않았습니다.',
					icon: '/android-chrome-192x192.png',
					badge: '/favicon-32x32.png',
				});
			}
		}
	};

	// 안드로이드 설치 팝업 표시
	const handleInstallClick = async () => {
		if (!deferredPrompt) {
			setIsAndroidGuideModalOpen(true);
			return;
		}

		// 설치 프롬프트 표시
		deferredPrompt.prompt();
		// 사용자 응답 대기
		const { outcome } = await deferredPrompt.userChoice;
		// 결과 처리
		if (outcome === 'accepted') {
			console.log('사용자가 앱 설치를 수락했습니다');
		} else {
			console.log('사용자가 앱 설치를 거부했습니다');
		}
		// 이벤트 초기화
		deferredPrompt = null;
	};

	return (
		<div className='flex flex-col min-h-screen '>
			{/* 헤더 */}

			{/* 설정 목록 */}
			<div className='flex-1 px-4 pb-4 space-y-4'>
				<div className='space-y-2'>
					<h3 className='text-sm font-medium text-gray-500 px-2 py-1 text-left'>
						앱 설정
					</h3>

					{/* 알림 설정 */}
					<div className='bg-white rounded-lg shadow-sm'>
						<div className='flex items-center justify-between p-4'>
							<div className='flex items-center'>
								<Bell className='w-5 h-5 text-gray-500 mr-3' />
								<span className='text-sm'>알림 설정</span>
							</div>
							<SwitchToggle
								checked={notificationsEnabled}
								onToggle={handleNotificationToggle}
								className={
									notificationLocked ? 'opacity-50 pointer-events-none' : ''
								}
							/>
						</div>
						<div className='h-px bg-gray-100' />

						{/* 로그아웃 */}
						<button
							className='w-full flex items-center justify-between p-4 text-left'
							onClick={logout}
						>
							<div className='flex items-center'>
								<LogOut className='w-5 h-5 text-gray-500 mr-3' />
								<span className='text-sm'>로그아웃</span>
							</div>
							<ChevronRight className='w-5 h-5 text-gray-400' />
						</button>
					</div>
				</div>

				{/* PWA 설치 가이드 */}
				<div className='space-y-2'>
					<h3 className='text-sm font-medium text-gray-500 px-2 py-1 text-left'>
						앱 설치 가이드
					</h3>

					<div className='bg-white rounded-lg shadow-sm'>
						{/* 아이폰 설치 가이드 */}
						<button
							className='w-full flex items-center justify-between p-4 text-left'
							onClick={() => setIsIosGuideModalOpen(true)}
						>
							<div className='flex items-center'>
								<Smartphone className='w-5 h-5 text-gray-500 mr-3' />
								<div>
									<span className='text-sm'>아이폰에서 설치하기</span>
									<p className='text-xs text-gray-500 mt-0.5'>
										홈 화면에 추가하기
									</p>
								</div>
							</div>
							<ChevronRight className='w-5 h-5 text-gray-400' />
						</button>
						<div className='h-px bg-gray-100' />

						{/* 안드로이드 설치 가이드 */}
						<button
							className='w-full flex items-center justify-between p-4 text-left'
							onClick={handleInstallClick}
						>
							<div className='flex items-center'>
								<Download className='w-5 h-5 text-gray-500 mr-3' />
								<div>
									<span className='text-sm'>
										갤럭시/안드로이드에서 설치하기
									</span>
									<p className='text-xs text-gray-500 mt-0.5'>
										앱 다운로드 방법
									</p>
								</div>
							</div>
							<ChevronRight className='w-5 h-5 text-gray-400' />
						</button>
					</div>
				</div>

				{/* 기타 정보 */}
				<div className='space-y-2'>
					<h3 className='text-sm font-medium text-gray-500 px-2 py-1 text-left'>
						정보
					</h3>

					<div className='bg-white rounded-lg shadow-sm'>
						<div className='flex items-center justify-between p-4'>
							<div className='flex items-center'>
								<Info className='w-5 h-5 text-gray-500 mr-3' />
								<span className='text-sm'>앱 버전</span>
							</div>
							<span className='text-sm text-gray-500'>1.0.0</span>
						</div>
					</div>
				</div>
			</div>

			{/* 하단 탭바 */}
			<div className='sticky bottom-0 border-t bg-white shadow-sm'>
				<div className='flex justify-around p-3'>
					<button className='flex flex-col items-center justify-center w-1/5'>
						<span className='text-xs mt-1'>전체</span>
					</button>
					<button className='flex flex-col items-center justify-center w-1/5'>
						<span className='text-xs mt-1'>아우터</span>
					</button>
					<button className='flex flex-col items-center justify-center w-1/5'>
						<span className='text-xs mt-1'>상의</span>
					</button>
					<button className='flex flex-col items-center justify-center w-1/5'>
						<span className='text-xs mt-1'>하의</span>
					</button>
					<button className='flex flex-col items-center justify-center w-1/5'>
						<span className='text-xs mt-1'>기타</span>
					</button>
				</div>
			</div>

			{/* 로그아웃 모달 */}
			<MainModal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
			>
				<MainModal.Header>
					<h3 className='text-center text-lg font-medium px-6'>로그아웃</h3>
				</MainModal.Header>
				<MainModal.Body>
					<p className='text-center mb-4'>정말 로그아웃 하시겠습니까?</p>
					<div className='flex space-x-3'>
						<button
							className='flex-1 py-2 px-4 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200 transition-colors'
							onClick={() => setIsLogoutModalOpen(false)}
						>
							취소
						</button>
						<button
							className='flex-1 py-2 px-4 bg-gray-900 rounded-md text-white font-medium hover:bg-gray-800 transition-colors'
							onClick={() => {
								// 로그아웃 로직 구현
								alert('로그아웃 되었습니다.');
								setIsLogoutModalOpen(false);
							}}
						>
							로그아웃
						</button>
					</div>
				</MainModal.Body>
			</MainModal>

			{/* iOS 설치 가이드 모달 */}
			<InstallGuideModal
				isOpen={isIosGuideModalOpen}
				onClose={() => setIsIosGuideModalOpen(false)}
				type='ios'
			/>

			{/* 안드로이드 설치 가이드 모달 */}
			<InstallGuideModal
				isOpen={isAndroidGuideModalOpen}
				onClose={() => setIsAndroidGuideModalOpen(false)}
				type='android'
			/>
		</div>
	);
};
