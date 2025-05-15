package com.ssafy.sharedress.domain.closet.error;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum ClosetClothesErrorCode implements ResponseCode {

	CLOSET_CLOTHES_NOT_FOUND("404", "옷장의 옷을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	CLOSET_CLOTHES_ALREADY_EXISTS("409", "이미 옷장에 등록된 옷입니다.", HttpStatus.CONFLICT),
	CLOSET_CLOTHES_NOT_BELONG_TO_MEMBER("403", "해당 옷장은 회원의 옷장이 아닙니다.", HttpStatus.FORBIDDEN);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	ClosetClothesErrorCode(String code, String message, HttpStatus httpStatus) {
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
