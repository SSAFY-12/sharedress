package com.ssafy.sharedress.application.brand.dto;

import com.ssafy.sharedress.domain.brand.entity.Brand;

public record BrandDetailResponse(
	Long id,
	String name
) {
	public static BrandDetailResponse from(Brand brand) {
		return new BrandDetailResponse(brand.getId(), brand.getNameKr());
	}
}
