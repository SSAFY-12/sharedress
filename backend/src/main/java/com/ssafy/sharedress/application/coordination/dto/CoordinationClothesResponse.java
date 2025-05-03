package com.ssafy.sharedress.application.coordination.dto;

import com.ssafy.sharedress.domain.coordination.entity.CoordinationClothes;

public record CoordinationClothesResponse(
	Long id,
	String image,
	PositionDto position,
	Float scale,
	Float rotation
) {
	public static CoordinationClothesResponse fromEntity(CoordinationClothes coordinationClothes) {
		return new CoordinationClothesResponse(
			coordinationClothes.getId(),
			coordinationClothes.getClosetClothes().getImageUrl(),
			new PositionDto(
				coordinationClothes.getPosition().getPosX(),
				coordinationClothes.getPosition().getPosY(),
				coordinationClothes.getPosition().getZIndex()
			),
			coordinationClothes.getScale(),
			coordinationClothes.getRotation()
		);
	}
}
