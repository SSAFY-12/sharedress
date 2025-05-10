package com.ssafy.sharedress.adapter.notification.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.notification.dto.NotificationReadResponse;
import com.ssafy.sharedress.application.notification.dto.NotificationResponse;
import com.ssafy.sharedress.application.notification.usecase.NotificationUseCase;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationUseCase notificationUseCase;

	// 알림 목록 조회
	@GetMapping("/notifications")
	public ResponseEntity<ResponseWrapper<List<NotificationResponse>>> getNotifications(
		@CurrentMember Member member
	) {
		List<NotificationResponse> result = notificationUseCase.getNotifications(member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	// 알림 읽음 처리
	@PatchMapping("/notifications/{notificationId}")
	public ResponseEntity<ResponseWrapper<NotificationReadResponse>> readNotification(
		@PathVariable Long notificationId,
		@CurrentMember Member member
	) {
		NotificationReadResponse result = notificationUseCase.readNotification(notificationId, member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}
}
