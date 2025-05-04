package com.ssafy.sharedress.application.clothes.dto;

import java.time.LocalDateTime;

public record ClothesSearchResponse(
	Long id,
	String name,
	String brandName, // 브랜드 한글 이름
	String image,
	LocalDateTime createdAt
) {
}
