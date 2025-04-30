package com.ssafy.sharedress.application.category.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.category.dto.CategoryResponse;
import com.ssafy.sharedress.application.category.usecase.CategoryUseCase;
import com.ssafy.sharedress.domain.category.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService implements CategoryUseCase {

	private final CategoryRepository categoryRepository;

	@Override
	public List<CategoryResponse> getAllCategories() {
		return categoryRepository.findAllByOrderByIdAsc().stream()
			.map(CategoryResponse::from)
			.toList();
	}
}
