package com.ssafy.sharedress.global.exception;

import com.ssafy.sharedress.global.response.ResponseCode;

public class BaseException extends RuntimeException {
	private final ResponseCode responseCode;

	public BaseException(ResponseCode responseCode) {
		super(responseCode.getMessage());
		this.responseCode = responseCode;
	}

	public ResponseCode getResponseCode() {
		return responseCode;
	}
}
