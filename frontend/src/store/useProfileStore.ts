import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
	myId: number | null;
	nickname: string | null;
	oneLiner: string | null;
	isPublic: boolean | undefined;
	setMyId: (myId: number) => void;
	getMyId: () => number | null;
	setIsPublic: (isPublic: boolean) => void;
	getIsPublic: () => boolean | undefined;
	setNickname: (nickname: string) => void;
	setOneLiner: (oneLiner: string) => void;
}

export const useProfileStore = create<ProfileState>()(
	persist(
		(set, get) => ({
			myId: null,
			nickname: null,
			oneLiner: null,
			setMyId: (myId) => set({ myId }),
			getMyId: () => get().myId,
			isPublic: undefined,
			setIsPublic: (isPublic) => set({ isPublic }),
			getIsPublic: () => get().isPublic,
			setNickname: (nickname) => set({ nickname }),
			setOneLiner: (oneLiner) => set({ oneLiner }),
		}),

		{
			name: 'profile-storage',
		},
	),
);
