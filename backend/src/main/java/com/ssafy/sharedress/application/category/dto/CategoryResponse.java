package com.ssafy.sharedress.application.category.dto;

import com.ssafy.sharedress.domain.category.entity.Category;

public record CategoryResponse(
	Long id,
	String name
) {
	public static CategoryResponse from(Category category) {
		return new CategoryResponse(
			category.getId(),
			category.getCategoryName()
		);
	}
}
