package com.ssafy.sharedress.domain.closet.error;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum ClosetClothesErrorCode implements ResponseCode {

	CLOSET_CLOTHES_NOT_FOUND("404", "옷장의 옷을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	CLOSET_CLOTHES_ALREADY_EXISTS("400", "이미 옷장에 등록된 옷입니다.", HttpStatus.BAD_REQUEST);

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
