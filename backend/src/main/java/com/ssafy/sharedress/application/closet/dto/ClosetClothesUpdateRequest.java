package com.ssafy.sharedress.application.closet.dto;

public record ClosetClothesUpdateRequest(
	String name,
	Long categoryId,
	Long brandId,
	Long colorId,
	Boolean isPublic
) {
}
