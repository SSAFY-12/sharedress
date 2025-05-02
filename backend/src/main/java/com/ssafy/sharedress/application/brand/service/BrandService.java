package com.ssafy.sharedress.application.brand.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.brand.dto.BrandSearchResponse;
import com.ssafy.sharedress.application.brand.usecase.BrandUseCase;
import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandService implements BrandUseCase {

	private final BrandRepository brandRepository;

	@Override
	public List<BrandSearchResponse> searchBrands(String keyword) {
		List<Brand> brands = keyword == null || keyword.isBlank()
			? brandRepository.findAll()
			: brandRepository.findByNameContaining(keyword);

		return brands.stream()
			.map(BrandSearchResponse::from)
			.toList();
	}
}
