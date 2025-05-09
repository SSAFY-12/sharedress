package com.ssafy.sharedress.application.notification.dto;

import com.ssafy.sharedress.domain.notification.entity.Notification;

public record NotificationReadResponse(
	Boolean isRead,
	Boolean isFirstRead
) {
	public static NotificationReadResponse from(Notification notification, Boolean isFirstRead) {
		return new NotificationReadResponse(
			notification.getIsRead(),
			isFirstRead
		);
	}
}
