package com.ssafy.sharedress.application.coordination.dto;

import java.time.LocalDateTime;

import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationComment;

public record CoordinationCommentResponse(
	Long id,
	String content,
	int depth,
	Long parentId,
	MemberProfileResponse creator,
	LocalDateTime createdAt
) {
	public static CoordinationCommentResponse from(CoordinationComment comment) {
		return new CoordinationCommentResponse(
			comment.getId(),
			comment.getContent(),
			comment.getDepth(),
			comment.getParent() != null ? comment.getParent().getId() : null,
			MemberProfileResponse.from(comment.getMember()),
			comment.getCreatedAt()
		);
	}
}
