package com.ssafy.sharedress.domain.shoppingmall.error;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum ShoppingMallErrorCode implements ResponseCode {
	SHOPPING_MALL_NOT_FOUND("404", "쇼핑몰을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	SHOPPING_MALL_ID_PW_NOT_MATCH("400", "아이디와 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	ShoppingMallErrorCode(String code, String message, HttpStatus httpStatus) {
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
