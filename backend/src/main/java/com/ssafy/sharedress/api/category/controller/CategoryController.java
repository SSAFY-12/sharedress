package com.ssafy.sharedress.api.category.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.api.category.dto.CategoryDto;
import com.ssafy.sharedress.domain.category.service.CategoryDomainService;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryDomainService categoryDomainService;

	@GetMapping("/clothes/categories")
	public ResponseEntity<ResponseWrapper<List<CategoryDto>>> getAllCategories() {
		List<CategoryDto> categories = categoryDomainService.findAll()
			.stream()
			.map(CategoryDto::from)
			.toList();
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, categories);
	}
}
