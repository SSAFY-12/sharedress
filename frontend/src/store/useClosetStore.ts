import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MyClosetContent {
	closetId: number;
	libraryId: number;
}

interface ClosetState {
	closet: MyClosetContent[];
	setCloset: (closet: MyClosetContent[]) => void;
	getCloset: () => MyClosetContent[];
	addCloset: (closet: MyClosetContent) => void;
	removeCloset: (closetId: number) => void;
}

export const useClosetStore = create<ClosetState>()(
	persist(
		(set, get) => ({
			closet: [],
			setCloset: (closet) => set({ closet }),
			getCloset: () => get().closet,
			addCloset: (closet: MyClosetContent) =>
				set((state) => ({ closet: [...state.closet, closet] })),
			removeCloset: (closetId: number) =>
				set((state) => ({
					closet: state.closet.filter((item) => item.closetId !== closetId),
				})),
		}),

		{
			name: 'closet-storage',
		},
	),
);
