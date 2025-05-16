package com.ssafy.sharedress.application.ai.dto;

import com.ssafy.sharedress.domain.ai.entity.AiTask;

public record AiTaskResponse(
	String taskId
) {
	public static AiTaskResponse from(AiTask aiTask) {
		return new AiTaskResponse(aiTask.getId());
	}
}
