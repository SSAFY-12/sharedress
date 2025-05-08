package com.ssafy.sharedress.application.notification.usecase;

public interface NotificationUseCase {
	void sendNotification(String fcmToken, String title, String body);
}
