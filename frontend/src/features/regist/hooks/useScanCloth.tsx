import { useMutation } from '@tanstack/react-query';
import { ScanApis } from '@/features/regist/api/registApis';
import { useScanStore } from '@/store/useScanStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

			toast.success(
				<div className='flex flex-col justify-center items-start'>
					<div className='text-smallButton text-left'>구매내역 스캔중</div>
					<div className='text-description text-left text-white'>
						완료가 되면 알림으로 알려드릴게요
					</div>
				</div>,
				{
					autoClose: 10000,
					icon: () => (
						<div className='flex items-center justify-center w-7 h-7'>
							<img src='/icons/toast_bell.png' alt='icon' />
						</div>
					),
				},
			);

			navigate('/regist/scan');
		},
		onError: async (error: any) => {
			// console.log(error, 'error'); // 아이디 비번 다를때 에러코드 분기처리 409 로 나옴
			if (error.response.data.status.code === '409') {
				toast.error('아이디 또는 패스워드를 확인하세요');
			} else {
				toast.error('구매내역 스캔에 실패했습니다.');
			}
		},
	});
};
