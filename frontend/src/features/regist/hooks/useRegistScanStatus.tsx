import { useQuery, UseQueryResult, Query } from '@tanstack/react-query';
import { ScanApis } from '@/features/regist/api/registApis';
import {
	RegistStatusRequest,
	RegistStatusResponse,
} from '@/features/regist/api/registApis';
import { useScanStore } from '@/store/useScanStore';
import { toast } from 'react-toastify';

export const useRegistScanStatus = (
	data: RegistStatusRequest,
	enabled: boolean,
): UseQueryResult<RegistStatusResponse> => {
	// console.log('훅 실행됨:', { data, enabled });
	const { setMusinsa, setCm29 } = useScanStore();

	return useQuery<RegistStatusResponse>({
		queryKey: ['registStatus', data.taskId, data.shopId],
		queryFn: () => ScanApis.getClothRegistrationStatus(data),
		refetchInterval: (query: Query<RegistStatusResponse>) => {
			// console.log('폴링 실행됨:', query.state.data);
			const response = query.state.data;
			if (response?.content?.completed) {
				if (data.shopId === 1) {
					setMusinsa({ isScan: false, taskId: '' });
				} else if (data.shopId === 2) {
					setCm29({ isScan: false, taskId: '' });
				}

				toast.success(
					<div className='flex flex-col justify-center items-start'>
						<div className='text-smallButton text-left'>구매내역 스캔 완료</div>
						<div className='text-description text-left text-white'>
							옷들을 옷장에 넣어 드렸어요
						</div>
					</div>,
					{
						autoClose: 10000,
						icon: () => (
							<div className='flex items-center justify-center w-7 h-7'>
								<img src='/icons/toast_closet.svg' alt='icon' />
							</div>
						),
					},
				);

				return false;
			}
			return 10000;
		},
		// 에러 발생 시 3번까지 재시도
		retry: 3,
		// status가 true로 들어올때만 활성화
		enabled: enabled && !!data.taskId,
		// 데이터가 즉시 오래된 것으로 간주되어 매번 새로운 데이터를 가져옴
		staleTime: 0,
	});
};
