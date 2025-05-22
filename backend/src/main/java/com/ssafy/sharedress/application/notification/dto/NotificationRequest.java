package com.ssafy.sharedress.application.notification.dto;

public record NotificationRequest(
	String fcmToken,
	String title,
	String body
) {
}
