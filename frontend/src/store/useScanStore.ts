import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScanState {
	musinsa: boolean;
	cm29: boolean;
	setMusinsa: (musinsa: boolean) => void;
	getMusinsa: () => boolean;
	setCm29: (cm29: boolean) => void;
	getCm29: () => boolean;
}

export const useScanStore = create<ScanState>()(
	persist(
		(set, get) => ({
			musinsa: false,
			cm29: false,
			setMusinsa: (musinsa) => set({ musinsa }),
			getMusinsa: () => get().musinsa,
			setCm29: (cm29: boolean) => set({ cm29 }),
			getCm29: () => get().cm29,
		}),

		{
			name: 'scan-storage',
		},
	),
);
