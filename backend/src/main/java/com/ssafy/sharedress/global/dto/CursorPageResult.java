package com.ssafy.sharedress.global.dto;

import java.util.List;

public record CursorPageResult<T>(
	List<T> contents,
	boolean hasNext,
	Long nextCursor
) {
}
