import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScanState {
	musinsa: {
		isScan: boolean;
		taskId: string;
	};
	cm29: {
		isScan: boolean;
		taskId: string;
	};
	setMusinsa: (musinsa: ScanState['musinsa']) => void;
	setCm29: (cm29: ScanState['cm29']) => void;
}

export const useScanStore = create<ScanState>()(
	persist(
		(set) => ({
			musinsa: {
				isScan: false,
				taskId: '',
			},
			cm29: {
				isScan: false, // 29cm 구매내역 스캔 상태
				taskId: '', // 29cm 구매내역 스캔 태스크 아이디
			},
			setMusinsa: (musinsa: ScanState['musinsa']) => set({ musinsa }), // 무신사 구매내역 스캔 상태 설정
			setCm29: (cm29: ScanState['cm29']) => set({ cm29 }), // 29cm 구매내역 스캔 상태 설정
		}),

		{
			name: 'scan-storage',
		},
	),
);
