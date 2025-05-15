package com.ssafy.sharedress.application.notification.usecase;

import java.util.List;

import com.ssafy.sharedress.application.notification.dto.NotificationReadResponse;
import com.ssafy.sharedress.application.notification.dto.NotificationResponse;

public interface NotificationUseCase {
	void sendFriendRequestNotification(Long senderId, Long receiverId, String message);

	void sendFriendAcceptNotification(Long receiverId, Long friendRequestId);

	void sendCoordinationRequestNotification(Long senderId, Long receiverId, String message);

	void sendCoordinationRecommendNotification(Long senderId, Long receiverId, String message);

	void sendCoordinationCopyNotification(Long coordinationId);

	void sendCommentNotification(Long senderId, Long coordinationId, Long parentId, String message);

	void sendAiCompleteNotification(Long memberId);

	List<NotificationResponse> getNotifications(Long memberId);

	NotificationReadResponse readNotification(Long notificationId, Long memberId);
}
