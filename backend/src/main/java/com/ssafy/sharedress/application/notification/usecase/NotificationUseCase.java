package com.ssafy.sharedress.application.notification.usecase;

public interface NotificationUseCase {
	void sendFriendRequestNotification(Long senderId, Long receiverId, String message);

	void sendFriendAcceptNotification(Long receiverId, Long friendRequestId);

	void sendCoordinationRequestNotification(Long senderId, Long receiverId, String message);

	void sendCoordinationRecommendNotification(Long senderId, Long receiverId, String message);

	void sendCoordinationCopyNotification(Long coordinationId);
}
