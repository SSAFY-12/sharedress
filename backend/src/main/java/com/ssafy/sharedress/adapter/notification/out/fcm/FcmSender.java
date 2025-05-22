package com.ssafy.sharedress.adapter.notification.out.fcm;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.Notification;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class FcmSender {

	private final MemberRepository memberRepository;

	@Transactional
	@Async("fcmExecutor")
	public void sendAsync(String fcmToken, String title, String body) {
		if (fcmToken == null) {
			return;
		}

		Notification notification = Notification.builder()
			.setTitle(title)
			.setBody(body)
			.build();

		Message message = Message.builder()
			.setToken(fcmToken)
			.setNotification(notification)
			.build();

		try {
			String response = FirebaseMessaging.getInstance().send(message);
			log.info("FCM 전송 성공: {}", response);
		} catch (FirebaseMessagingException e) {
			log.error("FCM 전송 실패: {}", e.getMessage());
			MessagingErrorCode errorCode = e.getMessagingErrorCode();
			if (errorCode == MessagingErrorCode.INVALID_ARGUMENT || errorCode == MessagingErrorCode.UNREGISTERED) {
				memberRepository.findByFcmToken(fcmToken)
					.ifPresent(member -> {
						member.clearFcmToken();
						memberRepository.save(member);
					});
			} else if (errorCode == MessagingErrorCode.INTERNAL || errorCode == MessagingErrorCode.UNAVAILABLE) {
				// TODO: retry 큐에 넣기
			}
		}
	}
}
