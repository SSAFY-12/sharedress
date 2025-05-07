package com.ssafy.sharedress.application.coordination.dto;

import java.time.LocalDateTime;

import com.ssafy.sharedress.domain.coordination.entity.Coordination;

public record CoordinationResponse(
	Long id,
	String title,
	String description,
	Boolean isPublic,
	Boolean isTemplate,
	String thumbnail,
	LocalDateTime createdAt
) {
	public static CoordinationResponse fromEntity(Coordination coordination) {
		return new CoordinationResponse(
			coordination.getId(),
			coordination.getTitle(),
			coordination.getContent(),
			coordination.getIsPublic(),
			coordination.getIsTemplate(),
			coordination.getThumbnail(),
			coordination.getCreatedAt()
		);
	}
}
