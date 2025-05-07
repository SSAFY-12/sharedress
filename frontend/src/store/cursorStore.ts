import { create } from 'zustand';

interface CursorState {
	cursors: { [key: string]: string | undefined };
	setCursor: (category: string, cursor: string | undefined) => void;
	getCursor: (category: string) => string | undefined;
	resetCursors: () => void;
}

export const useCursorStore = create<CursorState>((set, get) => ({
	cursors: {},
	setCursor: (category, cursor) =>
		set((state) => ({
			cursors: {
				...state.cursors,
				[category]: cursor,
			},
		})),
	getCursor: (category) => get().cursors[category],
	resetCursors: () => set({ cursors: {} }),
}));
