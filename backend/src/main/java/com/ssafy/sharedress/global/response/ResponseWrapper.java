package com.ssafy.sharedress.global.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.sharedress.global.dto.CursorPageResult;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResponseWrapper<T>(
	Status status,
	T content,
	Pagination pagination
) {
	public record Status(
		String code,
		String message
	) {
	}

	public record Pagination(
		int size,
		boolean hasNext,
		Object cursor
	) {
	}

	public ResponseWrapper(
		ResponseCode responseCode,
		T content
	) {
		this(
			new Status(responseCode.getCode(), responseCode.getMessage()),
			content,
			null
		);
	}

	public static <E> ResponseWrapper<List<E>> from(
		ResponseCode responseCode,
		CursorPageResult<E> pageResult
	) {
		return new ResponseWrapper<>(
			new Status(responseCode.getCode(), responseCode.getMessage()),
			pageResult.contents(),
			new Pagination(
				pageResult.contents().size(),
				pageResult.hasNext(),
				pageResult.nextCursor()
			)
		);
	}
}
