package com.ssafy.sharedress.application.ai.usecase;

import com.ssafy.sharedress.application.ai.dto.AiTaskCompletedResponse;
import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;
import com.ssafy.sharedress.domain.ai.entity.TaskType;

public interface AiTaskUseCase {
	AiTaskResponse createAiTask(Long memberId, TaskType taskType);

	AiTaskCompletedResponse getAiTaskCompleted(String taskId);
}
