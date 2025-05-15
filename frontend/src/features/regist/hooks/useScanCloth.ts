import { useMutation } from '@tanstack/react-query';
import { ScanApis } from '@/features/regist/api/registApis';
import { useScanStore } from '@/store/useScanStore';
import { useNavigate } from 'react-router-dom';
interface PurchaseHistoryRequest {
	shopId: number;
	id: string;
	password: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useScanCloth = () => {
	const { setMusinsa, setCm29 } = useScanStore();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (data: PurchaseHistoryRequest) => {
			const response = await ScanApis.getPurchaseHistory(data);
			return response;
		},
		onSuccess: async (_, data) => {
			console.log('스캔완료');
			if (data.shopId === 1) {
				setMusinsa(true);
				// 비동기적으로 5분 후 상태 변경
				delay(5 * 60 * 1000).then(() => {
					setMusinsa(false);
				});
			} else if (data.shopId === 2) {
				setCm29(true);
				// 비동기적으로 5분 후 상태 변경
				delay(5 * 60 * 1000).then(() => {
					setCm29(false);
				});
			}
			navigate('/regist/scan');

			if ('serviceWorker' in navigator && 'Notification' in window) {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification('구매내역 스캔 중', {
					body: '구매내역 스캔 중',
					icon: '/android-chrome-192x192.png',
					badge: '/favicon-32x32.png',
				});
				await registration.showNotification(
					'완료가 되면 알림으로 알려드릴게요',
					{
						body: '완료가 되면 알림으로 알려드릴게요',
						icon: '/android-chrome-192x192.png',
						badge: '/favicon-32x32.png',
					},
				);
			}
		},
		onError: async (error: any) => {
			console.log(error); // 아이디 비번 다를때 에러코드 분기처리 409 로 나옴

			if ('serviceWorker' in navigator && 'Notification' in window) {
				const registration = await navigator.serviceWorker.ready;
				await registration.showNotification(
					'아이디 또는 패스워드를 확인하세요',
					{
						body: '아이디 또는 패스워드를 확인하세요',
						icon: '/android-chrome-192x192.png',
						badge: '/favicon-32x32.png',
					},
				);
			}
		},
	});
};
