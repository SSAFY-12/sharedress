package com.ssafy.sharedress.application.clothes.dto;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;

public record ClothesPhotoUploadResponse(
	Long id,
	String image
) {

	public static ClothesPhotoUploadResponse from(ClosetClothes closetClothes, String image) {
		return new ClothesPhotoUploadResponse(closetClothes.getId(), image);
	}
}
