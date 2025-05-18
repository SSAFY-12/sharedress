package com.ssafy.sharedress.application.clothes.dto;

public record ClothesPhotoDetailRequest(
	Long id,
	String name,
	Long brandId,
	Long categoryId,
	Long colorId
) {
}
