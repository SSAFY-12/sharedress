import { useRegistCameraStatus } from '@/features/regist/hooks/useRegistCameraStatus';
import { useCameraStore } from '@/store/useCameraStore';

const PolingProvider = () => {
	const { camera } = useCameraStore();

	// 항상 Hook을 호출하되, enabled 조건으로 제어
	useRegistCameraStatus(camera.taskId, camera.isScan);
	// 실제 렌더링은 필요 없으므로 null 반환
	return null;
};

export default PolingProvider;
