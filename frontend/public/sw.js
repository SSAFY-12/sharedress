// Firebase 초기화 및 메시지 처리
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'FCM_CONFIG') {
		const config = event.data.config;
		firebase.initializeApp(config);
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

			self.registration.showNotification(
				notificationTitle,
				notificationOptions,
			);
		});
	}
});

// PWA 설치 및 활성화
self.addEventListener('install', (event) => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

// 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
	// OAuth 콜백이나 인증 관련 요청은 완전히 무시
	if (
		event.request.url.includes('/oauth/') ||
		event.request.url.includes('access_token') ||
		event.request.url.includes('auth')
	) {
		return;
	}

	// 다른 요청은 네트워크로 전달
	event.respondWith(
		fetch(event.request)
			.then((response) => response)
			.catch(() => {
				// 네트워크 요청 실패 시 기본 응답 반환
				return new Response('Network error', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: new Headers({
						'Content-Type': 'text/plain',
					}),
				});
			}),
	);
});
