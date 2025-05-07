package com.ssafy.sharedress.domain.coordination.error;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum CoordinationErrorCode implements ResponseCode {

	COORDINATION_NOT_FOUND("404", "코디를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	COORDINATION_IS_NOT_MINE("400", "코디가 본인의 소유물이 아닙니다.", HttpStatus.BAD_REQUEST),
	COORDINATION_ALREADY_MINE("400", "이미 본인의 코디입니다.", HttpStatus.BAD_REQUEST),
	INVALID_THUMBNAIL("400", "썸네일 이미지를 첨부해주세요.", HttpStatus.BAD_REQUEST);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	CoordinationErrorCode(String code, String message, HttpStatus httpStatus) {
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
