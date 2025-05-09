package com.ssafy.sharedress.adapter.notification.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.notification.dto.NotificationRequest;
import com.ssafy.sharedress.application.notification.usecase.NotificationUseCase;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {
	private final NotificationUseCase notificationUseCase;

	@PostMapping("/notifications/test")
	public ResponseEntity<ResponseWrapper<Void>> sendNotification(@RequestBody NotificationRequest request,
		@CurrentMember Member member) {
		if (member == null) {
			return ResponseWrapperFactory.toResponseEntity(HttpStatus.UNAUTHORIZED, null);
		}
		notificationUseCase.sendNotification(request.fcmToken(), request.title(), request.body());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}
}
