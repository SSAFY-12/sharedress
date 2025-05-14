import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
	requestNotificationPermission,
	onMessageListener,
} from '@/utils/firebase';
import useFcmStore from '@/store/useFcmStore';
import fcmApi from '@/features/alert/api/fcmapi';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * FCM(Firebase Cloud Messaging) 초기화를 위한 커스텀 훅
 * 알림 권한 요청, FCM 토큰 발급, 메시지 리스너 설정을 담당합니다.
 */
const useFcmInitialization = () => {
	useEffect(() => {
		const initializeFCM = async () => {
			try {
				// 현재 알림 권한 상태 확인
				const permission = await Notification.permission;
				const { accessToken } = useAuthStore.getState();
				let isSavingFcmToken = false;

				if (permission === 'default') {
					// 권한이 아직 요청되지 않은 경우
					toast.info('알림을 받으시려면 알림 권한을 허용해주세요.', {
						onClick: async () => {
							const token = await requestNotificationPermission();
							if (token) {
								toast.success('알림 권한이 허용되었습니다!');
								useFcmStore.setState({ token });
								if (accessToken && !isSavingFcmToken) {
									isSavingFcmToken = true;
									try {
										await fcmApi.saveFcmToken(token);
									} catch (error) {
										console.error('FCM 토큰 저장 실패:', error);
									}
									isSavingFcmToken = false;
								}

								// 포그라운드 메시지 리스너 설정
								onMessageListener()
									.then((payload) => {
										console.log('포그라운드 메시지 수신:', payload);
									})
									.catch((err) => {
										console.error('메시지 수신 실패:', err);
									});
							}
						},
					});
				} else if (permission === 'granted') {
					// 이미 권한이 허용된 경우
					const token = await requestNotificationPermission();
					if (token) {
						useFcmStore.setState({ token });
						if (accessToken) {
							try {
								await fcmApi.saveFcmToken(token);
							} catch (error) {
								console.error('FCM 토큰 저장 실패:', error);
							}
						}

						// 포그라운드 메시지 리스너 설정
						onMessageListener()
							.then((payload) => {
								console.log('포그라운드 메시지 수신:', payload);
							})
							.catch((err) => {
								console.error('메시지 수신 실패:', err);
							});
					}
				} else {
					// 권한이 거부된 경우
					toast.warning(
						'알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요.',
						{
							onClick: () => {
								// 브라우저 설정 페이지로 이동하는 방법은 브라우저마다 다름
								window.open(
									'chrome://settings/content/notifications',
									'_blank',
								);
							},
						},
					);
				}
			} catch (error) {
				console.error('FCM 초기화 실패:', error);
				toast.error('알림 설정 중 오류가 발생했습니다.');
			}
		};

		initializeFCM();
	}, []);
};

export default useFcmInitialization;
