import { create } from 'zustand';

export interface PhotoClothItem {
	file: File;
	previewUrl: string;
	name: string;
	brandId: number | null;
	categoryId: number | null;
	// isPublic: boolean;
}

interface PhotoClothState {
	items: PhotoClothItem[];
	currentIndex: number;
	setItems: (files: File[]) => void;
	updateItem: (index: number, data: Partial<PhotoClothItem>) => void;
	next: () => void;
	reset: () => void;
}

export const usePhotoClothStore = create<PhotoClothState>((set) => ({
	items: [],
	currentIndex: 0,
	setItems: (files) =>
		set({
			items: files.slice(0, 5).map((file) => ({
				file,
				previewUrl: URL.createObjectURL(file),
				name: '',
				brandId: null,
				categoryId: null,
				isPublic: true,
			})),
			currentIndex: 0,
		}),
	updateItem: (index, data) =>
		set((state) => {
			const updated = [...state.items];
			updated[index] = { ...updated[index], ...data };
			return { items: updated };
		}),
	next: () =>
		set((state) => ({
			currentIndex: Math.min(state.currentIndex + 1, state.items.length - 1),
		})),
	reset: () => set({ items: [], currentIndex: 0 }),
}));
