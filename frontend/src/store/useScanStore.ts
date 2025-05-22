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
				isScan: false,
				taskId: '',
			},
			setMusinsa: (musinsa: ScanState['musinsa']) => set({ musinsa }),
			setCm29: (cm29: ScanState['cm29']) => set({ cm29 }),
		}),

		{
			name: 'scan-storage',
		},
	),
);
