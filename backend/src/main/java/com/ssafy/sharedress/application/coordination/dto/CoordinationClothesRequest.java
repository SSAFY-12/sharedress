package com.ssafy.sharedress.application.coordination.dto;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationClothes;
import com.ssafy.sharedress.domain.coordination.entity.Position;

public record CoordinationClothesRequest(
	Long id,
	String image,
	PositionDto position,
	Float scale,
	Float rotation
) {

	public CoordinationClothes toEntity(Coordination coordination, ClosetClothes closetClothes) {
		return new CoordinationClothes(
			new Position(position.x(), position.y(), position.z()),
			scale,
			rotation,
			coordination,
			closetClothes
		);
	}
}
