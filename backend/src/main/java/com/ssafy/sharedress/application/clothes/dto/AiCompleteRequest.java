package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record AiCompleteRequest(
	Long memberId,
	String taskId,
	List<Long> successClothes,
	List<Long> failClothes
) {
}
