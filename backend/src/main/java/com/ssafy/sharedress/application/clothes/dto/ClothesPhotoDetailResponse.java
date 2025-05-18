package com.ssafy.sharedress.application.clothes.dto;

import com.ssafy.sharedress.domain.ai.entity.AiTask;

public record ClothesPhotoDetailResponse(
	String taskId
) {
	public static ClothesPhotoDetailResponse from(AiTask aiTask) {
		return new ClothesPhotoDetailResponse(aiTask.getId());
	}
}
