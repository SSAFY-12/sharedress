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
