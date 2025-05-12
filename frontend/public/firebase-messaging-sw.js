
		importScripts(
			'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
		);
		importScripts(
			'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
		);

		firebase.initializeApp({
			apiKey: 'undefined',
			authDomain: 'undefined',
			projectId: 'undefined',
			storageBucket: 'undefined',
			messagingSenderId: 'undefined',
			appId: 'undefined',
		});

		const messaging = firebase.messaging();

		messaging.onBackgroundMessage((payload) => {
			console.log('백그라운드 메시지 수신:', payload);

			const notificationTitle = payload.notification.title;
			const notificationOptions = {
				body: payload.notification.body,
				icon: '/android-chrome-192x192.png',
				badge: '/favicon-32x32.png',
				data: payload.data,
			};

			self.registration.showNotification(notificationTitle, notificationOptions);
		});
	