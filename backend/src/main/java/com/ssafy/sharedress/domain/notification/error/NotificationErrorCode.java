package com.ssafy.sharedress.domain.notification.error;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum NotificationErrorCode implements ResponseCode {

	// TODO[지윤]: 에러코드 정리
	NOTIFICATION_TYPE_NOT_FOUND("500", "데이터베이스 정합성 문제 / notification 테이블의 type 확인", HttpStatus.INTERNAL_SERVER_ERROR),
	NOTIFICATION_NOT_FOUND("404", "알림을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	FORBIDDEN_NOTIFICATION_ACCESS("403", "본인의 알림만 읽거나 수정할 수 있습니다.", HttpStatus.FORBIDDEN);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	NotificationErrorCode(String code, String message, HttpStatus httpStatus) {
		this.code = code;
		this.message = message;
		this.httpStatus = httpStatus;
	}

	@Override
	public String getCode() {
		return this.code;
	}

	@Override
	public String getMessage() {
		return this.message;
	}

	@Override
	public HttpStatus getHttpStatus() {
		return this.httpStatus;
	}
}
