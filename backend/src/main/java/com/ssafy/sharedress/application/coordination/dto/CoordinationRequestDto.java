package com.ssafy.sharedress.application.coordination.dto;

import java.util.List;

public record CoordinationRequestDto(
	String title,
	String description,
	Boolean isPublic,
	Boolean isTemplate,
	List<CoordinationClothesRequest> items
) {
}
