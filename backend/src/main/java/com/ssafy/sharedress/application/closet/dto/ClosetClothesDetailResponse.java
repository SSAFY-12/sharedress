package com.ssafy.sharedress.application.closet.dto;

import java.time.LocalDateTime;

import com.ssafy.sharedress.application.brand.dto.BrandDetailResponse;
import com.ssafy.sharedress.application.category.dto.CategoryResponse;
import com.ssafy.sharedress.application.color.dto.ColorResponse;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;

public record ClosetClothesDetailResponse(
	Long id,
	String image,
	String name,
	BrandDetailResponse brand,
	String shopName,
	ColorResponse color,
	CategoryResponse category,
	boolean isPublic,
	LocalDateTime createdAt
) {

	public static ClosetClothesDetailResponse from(ClosetClothes entity) {
		Clothes clothes = entity.getClothes();

		return new ClosetClothesDetailResponse(
			entity.getId(),
			entity.getImageUrl(),
			entity.getCustomName() != null ? entity.getCustomName() : clothes.getName(),
			entity.getCustomBrand() != null
				? BrandDetailResponse.from(entity.getCustomBrand())
				: BrandDetailResponse.from(clothes.getBrand()),
			clothes.getShoppingMall() != null ? clothes.getShoppingMall().getName() : null,
			entity.getCustomColor() != null
				? ColorResponse.from(entity.getCustomColor())
				: ColorResponse.from(clothes.getColor()),
			entity.getCustomCategory() != null
				? CategoryResponse.from(entity.getCustomCategory())
				: CategoryResponse.from(clothes.getCategory()),
			Boolean.TRUE.equals(entity.getIsPublic()),
			entity.getCreatedAt()
		);
	}

}
