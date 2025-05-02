package com.ssafy.sharedress.adapter.brand.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.brand.dto.BrandSearchResponse;
import com.ssafy.sharedress.application.brand.usecase.BrandUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BrandController {

	private final BrandUseCase brandUseCase;

	@GetMapping("/clothes/brands")
	public ResponseEntity<ResponseWrapper<List<BrandSearchResponse>>> searchBrands(
		@RequestParam(required = false) String keyword) {
		List<BrandSearchResponse> results = brandUseCase.searchBrands(keyword);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, results);
	}
}
