package com.ssafy.sharedress.api.color.dto;

import com.ssafy.sharedress.domain.color.entity.Color;

public record ColorDto(
	Long id,
	String name,
	String hexCode
) {
	public static ColorDto from(Color color) {
		return new ColorDto(
			color.getId(),
			color.getColorName(),
			color.getColorHex()
		);
	}
}
