package com.ssafy.sharedress.api.category.dto;

import com.ssafy.sharedress.domain.category.entity.Category;

public record CategoryDto(
	Long id,
	String name
) {
	public static CategoryDto from(Category category) {
		return new CategoryDto(
			category.getId(),
			category.getCategoryName()
		);
	}
}
