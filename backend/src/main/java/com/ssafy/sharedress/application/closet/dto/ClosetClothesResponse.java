package com.ssafy.sharedress.application.closet.dto;

import java.time.LocalDateTime;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;

public record ClosetClothesResponse(
	Long id,
	String image,
	String name,
	String brandName,
	Boolean isPublic,
	LocalDateTime createdAt
) {
	public static ClosetClothesResponse from(ClosetClothes entity) {
		Clothes clothes = entity.getClothes();

		return new ClosetClothesResponse(
			entity.getId(),
			entity.getImageUrl(),
			entity.getCustomName() != null ? entity.getCustomName() : clothes.getName(),
			entity.getCustomBrand() != null ? entity.getCustomBrand().getNameKr() : clothes.getBrand().getNameKr(),
			Boolean.TRUE.equals(entity.getIsPublic()),
			entity.getCreatedAt()
		);
	}
}
