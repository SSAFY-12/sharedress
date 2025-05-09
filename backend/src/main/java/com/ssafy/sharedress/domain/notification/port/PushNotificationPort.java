package com.ssafy.sharedress.domain.notification.port;

public interface PushNotificationPort {
	void send(String fcmToken, String title, String body);
}
