package com.ssafy.sharedress.adapter.notification.out.fcm;

import org.springframework.stereotype.Component;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.sharedress.domain.notification.port.PushNotificationPort;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FcmPushNotificationAdapter implements PushNotificationPort {
	@Override
	public void send(String fcmToken, String title, String body) {
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
		} catch (Exception e) {
			log.error("FCM 전송 실패: {}", e.getMessage(), e);
		}
	}
}
