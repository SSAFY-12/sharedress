package com.ssafy.sharedress.application.brand.dto;

import com.ssafy.sharedress.domain.brand.entity.Brand;

public record BrandSearchResponse(
	Long id,
	String brandNameKor,
	String brandNameEng
) {
	public static BrandSearchResponse from(Brand brand) {
		return new BrandSearchResponse(
			brand.getId(),
			brand.getNameKr(),
			brand.getNameEn()
		);
	}
}
