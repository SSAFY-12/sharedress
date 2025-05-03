package com.ssafy.sharedress.application.coordination.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.sharedress.domain.coordination.entity.Coordination;

public record CoordinationWithItemResponse(
	Long id,
	String title,
	String description,
	Boolean isPublic,
	Boolean isTemplate,
	List<CoordinationClothesResponse> items,
	LocalDateTime createdAt
) {
	public static CoordinationWithItemResponse fromEntity(
		Coordination coordination
	) {
		return new CoordinationWithItemResponse(
			coordination.getId(),
			coordination.getTitle(),
			coordination.getContent(),
			coordination.getIsPublic(),
			coordination.getIsTemplate(),
			coordination.getCoordinationClothes().stream()
				.map(CoordinationClothesResponse::fromEntity)
				.toList(),
			coordination.getCreatedAt()
		);
	}
}
