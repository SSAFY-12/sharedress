package com.ssafy.sharedress.application.closet.dto;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;

public record ClosetClothesIdResponse(
	Long id,
	Long libraryId
) {
	public static ClosetClothesIdResponse fromEntity(ClosetClothes closetClothes) {
		return new ClosetClothesIdResponse(
			closetClothes.getId(),
			closetClothes.getClothes().getId()
		);
	}
}
