import { useQuery, UseQueryResult, Query } from '@tanstack/react-query';
import { getCameraStatus } from '@/features/regist/api/registApis';
import { toast } from 'react-toastify';
import { useCameraStore } from '@/store/useCameraStore';

interface CameraStatusResponse {
	status: {
		code: string;
		message: string;
	};
	content: {
		completed: boolean;
	};
}

export const useRegistCameraStatus = (
	taskId: string,
	enabled: boolean,
): UseQueryResult<CameraStatusResponse> => {
	const { setCamera } = useCameraStore();
	// console.log('카메라 스캔 훅 실행됨');

	const queryResult = useQuery<CameraStatusResponse>({
		queryKey: ['cameraStatus', taskId],
		queryFn: () => getCameraStatus(taskId),
		refetchInterval: (query: Query<CameraStatusResponse>) => {
			// console.log('카메라 스캔 폴링 실행됨, data:', query.state.data);
			// console.log(query.state.data);
			if (query.state.data?.content?.completed) {
				// 카메라 스캔 스토어 false
				setCamera({ isScan: false, taskId: '' });
				toast.success(
					<div className='flex flex-col justify-center items-start'>
						<div className='text-smallButton text-left'>사진 변환 완료</div>
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
		retry: 3,
		enabled: enabled && !!taskId,
		staleTime: 0,
	});

	return queryResult;
};
