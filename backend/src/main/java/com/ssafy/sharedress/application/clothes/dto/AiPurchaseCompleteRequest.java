package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record AiPurchaseCompleteRequest(
	Long memberId,
	String taskId,
	List<Long> successClothes,
	List<Long> failClothes
) {
}
