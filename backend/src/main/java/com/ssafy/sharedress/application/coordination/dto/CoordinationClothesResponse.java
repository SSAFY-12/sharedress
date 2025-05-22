package com.ssafy.sharedress.application.coordination.dto;

import com.ssafy.sharedress.application.category.dto.CategoryResponse;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationClothes;

public record CoordinationClothesResponse(
	Long id,
	String image,
	PositionDto position,
	Float scale,
	Float rotation,
	CategoryResponse category
) {
	public static CoordinationClothesResponse fromEntity(CoordinationClothes coordinationClothes) {
		ClosetClothes closetClothes = coordinationClothes.getClosetClothes();
		return new CoordinationClothesResponse(
			coordinationClothes.getId(),
			closetClothes.getImageUrl(),
			new PositionDto(
				coordinationClothes.getPosition().getPosX(),
				coordinationClothes.getPosition().getPosY(),
				coordinationClothes.getPosition().getZIndex()
			),
			coordinationClothes.getScale(),
			coordinationClothes.getRotation(),
			CategoryResponse.from(closetClothes.getClothes().getCategory())
		);
	}
}
