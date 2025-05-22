package com.ssafy.sharedress.application.coordination.dto;

public record CreateCommentRequest(
	String content,
	Long parentId
) {
}
