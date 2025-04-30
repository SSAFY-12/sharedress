package com.ssafy.sharedress.adapter.category.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.category.dto.CategoryResponse;
import com.ssafy.sharedress.application.category.usecase.CategoryUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryUseCase categoryUseCase;

	@GetMapping("/clothes/categories")
	public ResponseEntity<ResponseWrapper<List<CategoryResponse>>> getAllCategories() {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, categoryUseCase.getAllCategories());
	}
}
