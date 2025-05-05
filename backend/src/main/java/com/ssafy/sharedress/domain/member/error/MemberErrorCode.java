package com.ssafy.sharedress.domain.member.error;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum MemberErrorCode implements ResponseCode {

	MEMBER_NOT_FOUND("404", "존재하지 않는 사용자입니다.", HttpStatus.NOT_FOUND),
	MEMBER_UNAUTHORIZED("401", "인증되지 않은 사용자입니다.", HttpStatus.UNAUTHORIZED);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	MemberErrorCode(String code, String message, HttpStatus httpStatus) {
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
