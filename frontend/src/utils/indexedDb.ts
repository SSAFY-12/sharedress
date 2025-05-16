import { openDB } from 'idb';

const DB_NAME = 'my-app-db';
const FCM_STORE = 'fcm-token';

export const saveFcmTokenToDb = async (token: string) => {
	const db = await openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(FCM_STORE))
				db.createObjectStore(FCM_STORE);
		},
	});
	await db.put(FCM_STORE, token, 'token');
};

export const getFcmTokenFromDb = async () => {
	const db = await openDB(DB_NAME, 1);
	return db.get(FCM_STORE, 'token');
};
