import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClosetItem {
	closetId: number;
	libraryId: number;
}

interface ClosetState {
	closet: ClosetItem[];
	setCloset: (closet: ClosetItem[]) => void;
	getCloset: () => ClosetItem[];
}

export const useClosetStore = create<ClosetState>()(
	persist(
		(set, get) => ({
			closet: [],
			setCloset: (closet) => set({ closet }),
			getCloset: () => get().closet,
		}),

		{
			name: 'closet-storage',
		},
	),
);
