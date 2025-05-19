import { useQuery, UseQueryResult, Query } from '@tanstack/react-query';
import { getCameraStatus } from '@/features/regist/api/registApis';
import { toast } from 'react-toastify';

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
): UseQueryResult<CameraStatusResponse> =>
	useQuery<CameraStatusResponse>({
		queryKey: ['cameraStatus', taskId],
		queryFn: () => getCameraStatus(taskId),
		refetchInterval: (query: Query<CameraStatusResponse>) => {
			if (query.state.data?.content?.completed) {
				toast.success(
					<div className='flex flex-col justify-center items-start'>
						<div className='text-smallButton text-left'>사진 분석 완료</div>
						<div className='text-description text-left text-white'>
							옷 정보를 분석했어요
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
