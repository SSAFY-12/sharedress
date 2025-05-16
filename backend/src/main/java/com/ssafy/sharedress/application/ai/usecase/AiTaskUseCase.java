package com.ssafy.sharedress.application.ai.usecase;

import com.ssafy.sharedress.application.ai.dto.AiTaskCompletedResponse;

public interface AiTaskUseCase {
	void updateCompletedAiTask(String taskId);

	AiTaskCompletedResponse getAiTaskCompleted(String taskId);
}
