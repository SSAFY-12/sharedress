// src/store/useFcmStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveFcmTokenToDb, getFcmTokenFromDb } from '@/utils/indexedDb';

interface FcmStore {
	token: string | null;
	setToken: (token: string | null) => void;
	clearToken: () => void;
	syncFromIndexedDb: () => Promise<void>;
}

const useFcmStore = create<FcmStore>()(
	persist(
		(set) => ({
			token: null,
			setToken: (token: string | null) => {
				set({ token });
				if (token) saveFcmTokenToDb(token);
			},
			clearToken: () => {
				set({ token: null });
				saveFcmTokenToDb('');
			},
			syncFromIndexedDb: async () => {
				const token = await getFcmTokenFromDb();
				set({ token: token || null });
			},
		}),
		{
			name: 'fcm-store',
		},
	),
);

export default useFcmStore;
