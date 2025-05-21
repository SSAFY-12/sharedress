
		importScripts(
			'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
		);
		importScripts(
			'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
		);

		firebase.initializeApp({
			apiKey: 'AIzaSyAohU9TYUEdEKjkItxUBoK9OHiiB4XyMYc',
			authDomain: 'sharedress-ef653.firebaseapp.com',
			projectId: 'sharedress-ef653',
			storageBucket: 'undefined',
			messagingSenderId: '237733873208',
			appId: '1:237733873208:web:05c3c8f958024eb3fb88cd',
		});

		const messaging = firebase.messaging();

		messaging.onBackgroundMessage((payload) => {
			// console.log('백그라운드 메시지 수신:', payload);

			const notificationTitle = payload.notification.title;
			const notificationOptions = {
				body: payload.notification.body,
				icon: '/new-android-chrome-192x192.png',
				badge: '/new-favicon-32x32.png',
				data: payload.data,
			};

			self.registration.showNotification(notificationTitle, notificationOptions);
		});

		self.addEventListener('notificationclick', (event) => {
			event.notification.close();

			// 알림 클릭 시 웹사이트로 이동
			event.waitUntil(
				clients.matchAll({ type: 'window' }).then((clientList) => {
					// 이미 열려있는 창이 있다면 그 창으로 이동
					for (const client of clientList) {
						if (client.url.includes('/') && 'focus' in client) {
							return client.focus();
						}
					}
					// 열려있는 창이 없다면 새 창 열기
					if (clients.openWindow) {
						return clients.openWindow('/');
					}
				}),
			);
		});
	