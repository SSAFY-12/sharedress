import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
	myId: number | null;
	setMyId: (myId: number) => void;
	getMyId: () => number | null;
}

export const useProfileStore = create<ProfileState>()(
	persist(
		(set, get) => ({
			myId: null,
			setMyId: (myId) => set({ myId }),
			getMyId: () => get().myId,
		}),

		{
			name: 'profile-storage',
		},
	),
);
