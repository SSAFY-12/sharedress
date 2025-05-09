import { MemberProfile } from '@/features/closet/api/myClosetApi';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
	profile: MemberProfile | null;
	setProfile: (profile: MemberProfile) => void;
}

export const useProfileStore = create<ProfileState>()(
	persist(
		(set) => ({
			profile: null,
			setProfile: (profile) => set({ profile }),
		}),
		{
			name: 'profile-storage',
		},
	),
);
