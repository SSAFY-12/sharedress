package com.ssafy.sharedress.application.notification.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.notification.dto.NotificationReadResponse;
import com.ssafy.sharedress.application.notification.dto.NotificationResponse;
import com.ssafy.sharedress.application.notification.usecase.NotificationUseCase;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationComment;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationCommentRepository;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.domain.notification.entity.Notification;
import com.ssafy.sharedress.domain.notification.entity.NotificationType;
import com.ssafy.sharedress.domain.notification.error.NotificationErrorCode;
import com.ssafy.sharedress.domain.notification.port.PushNotificationPort;
import com.ssafy.sharedress.domain.notification.repository.NotificationRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

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
	private final CoordinationCommentRepository coordinationCommentRepository;

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

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void sendCommentNotification(Long senderId, Long coordinationId, Long parentId, String message) {
		coordinationRepository.findById(coordinationId)
			.ifPresent(coordination -> {
				Member receiver = coordination.getCreator();
				if (parentId != null) {
					Optional<Member> member = coordinationCommentRepository.findById(parentId)
						.map(CoordinationComment::getMember);
					if (member.isPresent()) {
						receiver = member.get();
					} else {
						return;
					}
				}

				if (receiver == null) {
					return;
				}

				sendFcmNotification(
					receiver.getFcmToken(),
					"코디 댓글",
					message
				);

				saveNotification(
					memberRepository.getReferenceById(senderId),
					receiver,
					"코디 댓글",
					message,
					NotificationType.COMMENT
				);
			});
	}

	@Override
	public void sendAiCompleteNotification(Long memberId, String fcmToken) {
		sendFcmNotification(
			fcmToken,
			"AI 처리 완료",
			"AI 처리가 완료되었습니다."
		);
	}

	@Override
	@Transactional(readOnly = true)
	public List<NotificationResponse> getNotifications(Long memberId) {
		return notificationRepository.findByReceiverId(memberId)
			.stream()
			.map(NotificationResponse::from)
			.toList();
	}

	@Override
	@Transactional
	public NotificationReadResponse readNotification(Long notificationId, Long memberId) {
		Notification notification = notificationRepository.findById(notificationId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(NotificationErrorCode.NOTIFICATION_NOT_FOUND));

		if (!notification.getReceiver().getId().equals(memberId)) {
			ExceptionUtil.throwException(NotificationErrorCode.FORBIDDEN_NOTIFICATION_ACCESS);
		}

		boolean isFirstRead = false; // 최초 읽음 여부
		if (!notification.getIsRead()) {
			notification.updateIsRead(true);
			isFirstRead = true;
		}

		return NotificationReadResponse.from(notification, isFirstRead);
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
