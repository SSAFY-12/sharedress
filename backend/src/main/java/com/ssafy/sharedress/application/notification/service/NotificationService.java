package com.ssafy.sharedress.application.notification.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.notification.dto.NotificationResponse;
import com.ssafy.sharedress.application.notification.usecase.NotificationUseCase;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.domain.notification.entity.Notification;
import com.ssafy.sharedress.domain.notification.entity.NotificationType;
import com.ssafy.sharedress.domain.notification.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService implements NotificationUseCase {

	private final NotificationRepository notificationRepository;
	private final FriendRequestRepository friendRequestRepository;
	private final CoordinationRepository coordinationRepository;
	private final MemberRepository memberRepository;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void sendFriendRequestNotification(Long senderId, Long receiverId, String message) {
		// TODO: FCM 알림
		saveNotification(
			memberRepository.getReferenceById(senderId),
			memberRepository.getReferenceById(receiverId),
			"친구 요청",
			message,
			NotificationType.FRIEND_REQUEST
		);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void sendFriendAcceptNotification(Long receiverId, Long friendRequestId) {
		friendRequestRepository.findByIdAndReceiverId(friendRequestId, receiverId)
			.ifPresent(friendRequest -> {
				// TODO: FCM 알림

				saveNotification(
					friendRequest.getRequester(),
					friendRequest.getReceiver(),
					"친구 요청 수락",
					friendRequest.getMessage(),
					NotificationType.FRIEND_ACCEPT
				);
			});
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void sendCoordinationRequestNotification(Long senderId, Long receiverId, String message) {
		// TODO: FCM 알림

		saveNotification(
			memberRepository.getReferenceById(senderId),
			memberRepository.getReferenceById(receiverId),
			"코디 요청",
			message,
			NotificationType.COORDINATION_REQUEST
		);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void sendCoordinationRecommendNotification(Long senderId, Long receiverId, String message) {
		// TODO: FCM 알림

		saveNotification(
			memberRepository.getReferenceById(senderId),
			memberRepository.getReferenceById(receiverId),
			"코디 추천",
			message,
			NotificationType.COORDINATION_RECOMMEND
		);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void sendCoordinationCopyNotification(Long coordinationId) {
		coordinationRepository.findById(coordinationId)
			.ifPresent(coordination -> {
				Member originCreator = coordination.getOriginCreator();
				if (originCreator == null) {
					return;
				}

				// TODO: FCM 알림

				saveNotification(
					coordination.getOwner(),
					originCreator,
					"코디 편입",
					"코디를 복사했어요!",
					NotificationType.COORDINATION_COPY
				);
			});
	}

	@Override
	public List<NotificationResponse> getNotifications(Long memberId) {
		return notificationRepository.findByReceiverId(memberId)
			.stream()
			.map(notification -> NotificationResponse.from(
				notification.getId(),
				notification.getType().getCode().toString(),
				notification.getTitle(),
				notification.getBody(),
				notification.getIsRead(),
				notification.getCreatedAt().toString()
			))
			.toList();
	}

	private void saveNotification(Member sender, Member receiver, String title, String message, NotificationType type) {
		notificationRepository.save(new Notification(
			sender,
			receiver,
			type,
			title,
			message,
			false
		));
	}
}
