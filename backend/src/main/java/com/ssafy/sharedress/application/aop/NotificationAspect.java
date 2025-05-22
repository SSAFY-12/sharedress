package com.ssafy.sharedress.application.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestRequest;
import com.ssafy.sharedress.application.coordination.dto.CreateCommentRequest;
import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;
import com.ssafy.sharedress.application.notification.usecase.NotificationUseCase;
import com.ssafy.sharedress.domain.common.context.UserContext;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationAspect {

	private final NotificationUseCase notificationUseCase;

	@AfterReturning(value = "@annotation(sendNotification)", returning = "result")
	public void sendNotification(JoinPoint joinPoint, SendNotification sendNotification, Object result) {
		Object[] args = joinPoint.getArgs();

		switch (sendNotification.value()) {
			case FRIEND_REQUEST -> {
				Long senderId = (Long)args[0];
				FriendRequestDto friendRequestDto = (FriendRequestDto)args[1];
				notificationUseCase.sendFriendRequestNotification(
					senderId,
					friendRequestDto.receiverId(),
					friendRequestDto.message()
				);
			}
			case FRIEND_ACCEPT -> {
				Long receiverId = (Long)args[0];
				Long friendRequestId = (Long)args[1];
				notificationUseCase.sendFriendAcceptNotification(receiverId, friendRequestId);
			}
			case COORDINATION_REQUEST -> {
				Long senderId = (Long)args[0];
				CoordinationRequestRequest coordinationRequestRequest = (CoordinationRequestRequest)args[1];
				notificationUseCase.sendCoordinationRequestNotification(senderId,
					coordinationRequestRequest.receiverId(), coordinationRequestRequest.message());
			}
			case COORDINATION_RECOMMEND -> {
				UserContext sender = (UserContext)args[0];
				Long receiverId = (Long)args[1];
				if (sender.isGuest()) {
					notificationUseCase.sendCoordinationRecommendNotification(
						-2L,
						receiverId,
						"코디를 추천했어요!"
					);
				} else {
					notificationUseCase.sendCoordinationRecommendNotification(sender.getId(), receiverId, "코디를 추천했어요!");
				}
			}
			case COORDINATION_COPY -> {
				Long coordinationId = (Long)args[1];
				notificationUseCase.sendCoordinationCopyNotification(coordinationId);
			}
			case COMMENT -> {
				Long coordinationId = (Long)args[0];
				CreateCommentRequest dto = (CreateCommentRequest)args[1];
				Long memberId = (Long)args[2];
				notificationUseCase.sendCommentNotification(memberId, coordinationId, dto.parentId(), dto.content());
			}
			case AI_COMPLETE -> {
				Long memberId = (Long)args[0];
				notificationUseCase.sendAiCompleteNotification(memberId);
			}
			// TODO: 알림이 필요한 부분 추가
		}
	}
}
