package com.ssafy.sharedress.domain.coordination.error;

import org.springframework.http.HttpStatus;

import com.ssafy.sharedress.global.response.ResponseCode;

public enum CoordinationCommentErrorCode implements ResponseCode {

	PARENT_COMMENT_NOT_FOUND("404", "부모 댓글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	CANNOT_REPLY_TO_CHILD_COMMENT("400", "이미 대댓글인 댓글에는 답글을 달 수 없습니다.", HttpStatus.BAD_REQUEST);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	CoordinationCommentErrorCode(String code, String message, HttpStatus httpStatus) {
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
