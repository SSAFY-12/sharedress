package com.ssafy.sharedress.application.brand.usecase;

import java.util.List;

import com.ssafy.sharedress.application.brand.dto.BrandSearchResponse;

public interface BrandUseCase {
	// 브랜드 검색
	List<BrandSearchResponse> searchBrands(String keyword);
}
