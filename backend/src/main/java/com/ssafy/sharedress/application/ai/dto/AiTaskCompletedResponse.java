package com.ssafy.sharedress.application.ai.dto;

import com.ssafy.sharedress.domain.ai.entity.AiTask;

public record AiTaskCompletedResponse(
	Boolean completed
) {
	public static AiTaskCompletedResponse from(AiTask aiTask) {
		return new AiTaskCompletedResponse(
			aiTask.isCompleted()
		);
	}
}
