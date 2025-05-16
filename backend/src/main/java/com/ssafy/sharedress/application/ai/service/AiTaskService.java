package com.ssafy.sharedress.application.ai.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.ai.dto.AiTaskCompletedResponse;
import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;
import com.ssafy.sharedress.application.ai.usecase.AiTaskUseCase;
import com.ssafy.sharedress.domain.ai.entity.AiTask;
import com.ssafy.sharedress.domain.ai.entity.TaskType;
import com.ssafy.sharedress.domain.ai.error.TaskErrorCode;
import com.ssafy.sharedress.domain.ai.repository.AiTaskRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiTaskService implements AiTaskUseCase {

	private final AiTaskRepository aiTaskRepository;
	private final MemberRepository memberRepository;

	@Override
	public AiTaskResponse createAiTask(Long memberId, TaskType taskType) {
		String taskId = UUID.randomUUID().toString();
		Member member = memberRepository.getReferenceById(memberId);

		AiTask aiTask = aiTaskRepository.save(new AiTask(taskId, false, member, taskType));
		return AiTaskResponse.from(aiTask);
	}

	@Override
	public AiTaskCompletedResponse getAiTaskCompleted(String taskId) {
		return aiTaskRepository.findById(taskId)
			.map(AiTaskCompletedResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(TaskErrorCode.TASK_NOT_FOUND));
	}
}
