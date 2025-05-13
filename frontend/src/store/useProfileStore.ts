import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
	myId: number | null;
	isPublic: boolean | undefined;
	isGuest: boolean | undefined;
	setMyId: (myId: number) => void;
	getMyId: () => number | null;
	setIsPublic: (isPublic: boolean) => void;
	getIsPublic: () => boolean | undefined;
	setIsGuest: (isGuest: boolean) => void;
	getIsGuest: () => boolean | undefined;
}

export const useProfileStore = create<ProfileState>()(
	persist(
		(set, get) => ({
			myId: null,
			setMyId: (myId) => set({ myId }),
			getMyId: () => get().myId,
			isPublic: undefined,
			setIsPublic: (isPublic) => set({ isPublic }),
			getIsPublic: () => get().isPublic,
			isGuest: undefined,
			setIsGuest: (isGuest) => set({ isGuest }),
			getIsGuest: () => get().isGuest,
		}),

		{
			name: 'profile-storage',
		},
	),
);
