export const registerServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/firebase-messaging-sw.js')
			.then((registration) => {
				// FCM 설정 전달
				registration.active?.postMessage({
					type: 'FCM_CONFIG',
					config: {
						apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
						authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
						projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
						storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
						messagingSenderId: import.meta.env
							.VITE_FIREBASE_MESSAGING_SENDER_ID,
						appId: import.meta.env.VITE_FIREBASE_APP_ID,
					},
				});
			})
			.catch((error) => {
				console.error('Service Worker 등록 실패:', error);
			});
	}
};
