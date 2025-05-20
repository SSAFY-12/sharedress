import { useRegistScanStatus } from '@/features/regist/hooks/useRegistScanStatus';
import { useScanStore } from '@/store/useScanStore';

const PolingProvider = () => {
	const { musinsa, cm29 } = useScanStore();

	// 항상 Hook을 호출하되, enabled 조건으로 제어
	useRegistScanStatus(
		{
			taskId: musinsa.taskId,
			shopId: 1,
		},
		musinsa.isScan,
	);

	useRegistScanStatus(
		{
			taskId: cm29.taskId,
			shopId: 2,
		},
		cm29.isScan,
	);

	// 실제 렌더링은 필요 없으므로 null 반환
	return null;
};

export default PolingProvider;
