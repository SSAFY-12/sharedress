package com.ssafy.sharedress.application.notification.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.notification.usecase.NotificationUseCase;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.domain.notification.entity.Notification;
import com.ssafy.sharedress.domain.notification.entity.NotificationType;
import com.ssafy.sharedress.domain.notification.port.PushNotificationPort;
import com.ssafy.sharedress.domain.notification.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService implements NotificationUseCase {

	private final NotificationRepository notificationRepository;
	private final FriendRequestRepository friendRequestRepository;
	private final CoordinationRepository coordinationRepository;
	private final MemberRepository memberRepository;

	private final PushNotificationPort pushNotificationPort;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void sendFriendRequestNotification(Long senderId, Long receiverId, String message) {
		sendFcmNotification(
			memberRepository.findById(receiverId)
				.map(Member::getFcmToken)
				.orElse(null),
			"친구 요청",
			message
		);

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
				sendFcmNotification(
					friendRequest.getRequester().getFcmToken(),
					"친구 요청 수락",
					friendRequest.getMessage()
				);

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
		sendFcmNotification(
			memberRepository.findById(receiverId)
				.map(Member::getFcmToken)
				.orElse(null),
			"코디 요청",
			message
		);

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
		sendFcmNotification(
			memberRepository.findById(receiverId)
				.map(Member::getFcmToken)
				.orElse(null),
			"코디 추천",
			message
		);

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

				sendFcmNotification(
					originCreator.getFcmToken(),
					"코디 편입",
					"코디를 복사했어요!"
				);

				saveNotification(
					coordination.getOwner(),
					originCreator,
					"코디 편입",
					"코디를 복사했어요!",
					NotificationType.COORDINATION_COPY
				);
			});
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

	private void sendFcmNotification(String fcmToken, String title, String body) {
		pushNotificationPort.send(fcmToken, title, body);
	}
}
