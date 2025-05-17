package com.ssafy.sharedress.application.ai.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.ai.dto.AiTaskCompletedResponse;
import com.ssafy.sharedress.application.ai.usecase.AiTaskUseCase;
import com.ssafy.sharedress.domain.ai.entity.AiTask;
import com.ssafy.sharedress.domain.ai.error.TaskErrorCode;
import com.ssafy.sharedress.domain.ai.repository.AiTaskRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiTaskService implements AiTaskUseCase {

	private final AiTaskRepository aiTaskRepository;

	@Transactional
	@Override
	public void updateCompletedAiTask(String taskId) {
		AiTask aiTask = aiTaskRepository.findById(taskId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(TaskErrorCode.TASK_NOT_FOUND));
		aiTask.updateCompleted();
	}

	@Transactional(readOnly = true)
	@Override
	public AiTaskCompletedResponse getAiTaskCompleted(String taskId, Long shopId) {
		return aiTaskRepository.findByIdAndShopId(taskId, shopId)
			.map(AiTaskCompletedResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(TaskErrorCode.TASK_NOT_FOUND));
	}
}
