package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record AiCompleteRequest(
	Long memberId,
	List<Long> successClothes,
	List<Long> failClothes
) {
}
