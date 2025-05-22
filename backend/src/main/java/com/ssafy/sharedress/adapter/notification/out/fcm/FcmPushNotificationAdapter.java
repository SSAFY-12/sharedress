package com.ssafy.sharedress.adapter.notification.out.fcm;

import org.springframework.stereotype.Component;

import com.ssafy.sharedress.domain.notification.port.PushNotificationPort;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FcmPushNotificationAdapter implements PushNotificationPort {

	private final FcmSender fcmSender;

	@Override
	public void send(String fcmToken, String title, String body) {
		fcmSender.sendAsync(fcmToken, title, body);
	}
}
