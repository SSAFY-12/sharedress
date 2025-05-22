package com.ssafy.sharedress.application.jwt;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum TokenErrorCode implements ResponseCode {

	TOKEN_NOT_FOUND("401", "토큰이 존재하지 않습니다.", HttpStatus.UNAUTHORIZED),
	TOKEN_INVALID("401", "유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	TokenErrorCode(String code, String message, HttpStatus httpStatus) {
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

