import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
	requestNotificationPermission,
	onMessageListener,
} from '@/utils/firebase';
import useFcmStore from '@/store/useFcmStore';
import { useAuthStore } from '@/store/useAuthStore';
import useFcmToken from './useFcmToken';

/**
 * FCM(Firebase Cloud Messaging) 초기화를 위한 커스텀 훅
 * 알림 권한 요청, FCM 토큰 발급, 메시지 리스너 설정을 담당합니다.
 */
export const useFcmInitialization = () => {
	const { isAuthenticated } = useAuthStore();
	const { token: fcmToken } = useFcmStore();
	const { saveFcmToken } = useFcmToken();

	// 함수들을 ref로 저장
	const saveFcmTokenRef = useRef(saveFcmToken);

	// ref 업데이트
	useEffect(() => {
		saveFcmTokenRef.current = saveFcmToken;
	}, [saveFcmToken]);

	// FCM 초기화
	useEffect(() => {
		const initializeFCM = async () => {
			try {
				const permission = await Notification.permission;

				if (permission === 'default') {
					toast.info('알림을 받으시려면 알림 권한을 허용해주세요.', {
						onClick: async () => {
							const token = await requestNotificationPermission();
							if (token) {
								toast.success('알림 권한이 허용되었습니다!');
								useFcmStore.setState({ token });
								if (isAuthenticated) {
									saveFcmTokenRef.current();
								}

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
					const token = await requestNotificationPermission();
					if (token) {
						useFcmStore.setState({ token });
						if (isAuthenticated) {
							saveFcmTokenRef.current();
						}

						onMessageListener()
							.then((payload) => {
								console.log('포그라운드 메시지 수신:', payload);
							})
							.catch((err) => {
								console.error('메시지 수신 실패:', err);
							});
					}
				} else {
					toast.warning(
						'알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요.',
						{
							onClick: () => {
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

		if (isAuthenticated) {
			initializeFCM();
		}
	}, [isAuthenticated]);

	// FCM 토큰이 변경될 때마다 저장
	useEffect(() => {
		if (isAuthenticated && fcmToken) {
			saveFcmTokenRef.current();
		}
	}, [isAuthenticated, fcmToken]);
};
