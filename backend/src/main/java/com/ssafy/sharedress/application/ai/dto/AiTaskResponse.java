package com.ssafy.sharedress.application.ai.dto;

import com.ssafy.sharedress.domain.ai.entity.AiTask;

public record AiTaskResponse(
	String taskId,
	Long shopId
) {
	public static AiTaskResponse from(AiTask aiTask, Long shopId) {
		return new AiTaskResponse(aiTask.getId(), shopId);
	}
}
