package com.ssafy.sharedress.application.notification.dto;

public record NotificationResponse(
	Long id,
	String type,
	String title,
	String body,
	Boolean isRead,
	String createdAt
) {
	public static NotificationResponse from(
		Long id,
		String type,
		String title,
		String body,
		Boolean isRead,
		String createdAt
	) {
		return new NotificationResponse(id, type, title, body, isRead, createdAt);
	}
}
