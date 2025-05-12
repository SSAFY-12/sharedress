import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FcmStore {
	token: string | null;
}

const useFcmStore = create<FcmStore>()(
	persist(
		(set) => ({
			token: null,
			setToken: (token: string | null) => set({ token }),
			clearToken: () => set({ token: null }),
		}),
		{
			name: 'fcm-store',
		},
	),
);

export default useFcmStore;
