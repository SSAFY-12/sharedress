package com.ssafy.sharedress.domain.clothes.entity;

import java.util.Arrays;

import lombok.Getter;

@Getter
public enum ClothesSourceType {
	SHOPPING_MALL("쇼핑몰", 1),
	PHOTO("사진", 2);

	private final String description;

	private final Integer code;

	ClothesSourceType(String description, Integer code) {
		this.description = description;
		this.code = code;
	}

	public static ClothesSourceType of(Integer code) {
		return Arrays.stream(ClothesSourceType.values())
			.filter(type -> type.getCode().equals(code))
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("Invalid code: " + code));
	}
}
