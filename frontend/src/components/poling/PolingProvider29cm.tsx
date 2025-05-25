import { useRegistScanStatus } from '@/features/regist/hooks/useRegistScanStatus';
import { useScanStore } from '@/store/useScanStore';

const PolingProvider = () => {
	const { cm29 } = useScanStore(); // 29cm 구매내역 스캔 상태

	// 항상 Hook을 호출하되, enabled 조건으로 제어
	useRegistScanStatus(
		{
			taskId: cm29.taskId, // 29cm 구매내역 스캔 태스크 아이디
			shopId: 3, // 29cm 구매내역 스캔 상점 아이디
		},
		cm29.isScan, // 29cm 구매내역 스캔 상태
	);

	// 실제 렌더링은 필요 없으므로 null 반환
	return null;
};

export default PolingProvider;
