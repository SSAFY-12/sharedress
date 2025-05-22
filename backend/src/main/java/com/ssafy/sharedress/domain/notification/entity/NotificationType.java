package com.ssafy.sharedress.domain.notification.entity;

import java.util.Arrays;

import com.ssafy.sharedress.domain.notification.error.NotificationErrorCode;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.Getter;

@Getter
public enum NotificationType {
	FRIEND_REQUEST(1),    // 친구 요청
	FRIEND_ACCEPT(2),    // 친구 수락
	COORDINATION_REQUEST(3),    // 코디 요청
	COORDINATION_RECOMMEND(4),    // 코디 추천
	COORDINATION_COPY(5),    // 코디 복사
	COMMENT(6),    // 코디 댓글
	AI_COMPLETE(7);    // AI 처리 완료

	public final Integer code;

	NotificationType(Integer code) {
		this.code = code;
	}

	public static NotificationType of(Integer code) {
		return Arrays.stream(NotificationType.values())
			.filter(type -> type.getCode().equals(code))
			.findFirst()
			.orElseThrow(ExceptionUtil.exceptionSupplier(NotificationErrorCode.NOTIFICATION_TYPE_NOT_FOUND));
	}
}
