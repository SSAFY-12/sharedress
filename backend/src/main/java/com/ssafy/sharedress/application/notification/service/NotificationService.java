package com.ssafy.sharedress.application.notification.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.notification.usecase.NotificationUseCase;
import com.ssafy.sharedress.domain.notification.port.PushNotificationPort;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService implements NotificationUseCase {

	private final PushNotificationPort pushNotificationPort;

	@Override
	@Transactional
	public void sendNotification(String fcmToken, String title, String body) {
		pushNotificationPort.send(fcmToken, title, body);
	}
}
