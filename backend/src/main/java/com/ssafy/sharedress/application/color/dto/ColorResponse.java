package com.ssafy.sharedress.application.color.dto;

import com.ssafy.sharedress.domain.color.entity.Color;

public record ColorResponse(
	Long id,
	String name,
	String hexCode
) {
	public static ColorResponse from(Color color) {
		return new ColorResponse(
			color.getId(),
			color.getColorName(),
			color.getColorHex()
		);
	}
}
