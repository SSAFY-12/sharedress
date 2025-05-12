package com.ssafy.sharedress.application.brand.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.brand.dto.BrandSearchResponse;
import com.ssafy.sharedress.application.brand.usecase.BrandUseCase;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandService implements BrandUseCase {

	private final BrandRepository brandRepository;

	@Override
	public CursorPageResult<BrandSearchResponse> searchBrands(
		String keyword,
		Long cursor,
		int size
	) {
		return brandRepository.searchBrandsWithCursor(keyword, cursor, size);
	}
}
