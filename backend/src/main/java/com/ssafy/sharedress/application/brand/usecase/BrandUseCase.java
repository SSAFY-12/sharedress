package com.ssafy.sharedress.application.brand.usecase;

import com.ssafy.sharedress.application.brand.dto.BrandSearchResponse;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface BrandUseCase {
	// 브랜드 검색
	CursorPageResult<BrandSearchResponse> searchBrands(
		String keyword,
		Long cursor,
		int size
	);
}
