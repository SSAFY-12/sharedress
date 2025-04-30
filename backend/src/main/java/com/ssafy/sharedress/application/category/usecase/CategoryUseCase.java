package com.ssafy.sharedress.application.category.usecase;

import java.util.List;

import com.ssafy.sharedress.application.category.dto.CategoryResponse;

public interface CategoryUseCase {
	List<CategoryResponse> getAllCategories();
}
