import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SocialState {
	hasRequest: boolean;
	setHasRequest: (hasRequest: boolean) => void;
}

export const useSocialStore = create<SocialState>()(
	persist(
		(set) => ({
			hasRequest: false,
			setHasRequest: (hasRequest) => set({ hasRequest }),
		}),

		{
			name: 'social-storage',
		},
	),
);
