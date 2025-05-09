package com.ssafy.sharedress.application.notification.dto;

import java.time.LocalDateTime;

import com.ssafy.sharedress.domain.notification.entity.Notification;

public record NotificationResponse(
	Long id,
	Integer notificationType,
	String title,
	String body,
	Boolean isRead,
	LocalDateTime createdAt
) {
	public static NotificationResponse from(Notification notification) {
		return new NotificationResponse(
			notification.getId(),
			notification.getType().code,
			notification.getTitle(),
			notification.getBody(),
			notification.getIsRead(),
			notification.getCreatedAt()
		);
	}
}
