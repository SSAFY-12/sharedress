package com.ssafy.sharedress.application.notification.dto;

import java.time.LocalDateTime;

import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.domain.notification.entity.Notification;

public record NotificationResponse(
	Long id,
	Integer notificationType,
	String title,
	String body,
	Boolean isRead,
	MemberProfileResponse requester,
	LocalDateTime createdAt
) {
	public static NotificationResponse from(Notification notification) {
		return new NotificationResponse(
			notification.getId(),
			notification.getType().code,
			notification.getTitle(),
			notification.getBody(),
			notification.getIsRead(),
			MemberProfileResponse.from(notification.getSender()),
			notification.getCreatedAt()
		);
	}
}
