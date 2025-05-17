package com.ssafy.sharedress.adapter.ai.in;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.ai.dto.AiTaskCompletedResponse;
import com.ssafy.sharedress.application.ai.usecase.AiTaskUseCase;
import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AiTaskController {

	private final AiTaskUseCase aiTaskUseCase;

	@GetMapping("closet/clothes/purchase-history/task/{taskId}")
	public ResponseEntity<ResponseWrapper<AiTaskCompletedResponse>> updateCompletedAiTask(
		@CurrentMember Member member,
		@PathVariable("taskId") String taskId,
		@RequestParam Long shopId
	) {
		return ResponseWrapperFactory.toResponseEntity(
			HttpStatus.OK,
			aiTaskUseCase.getAiTaskCompleted(taskId, shopId)
		);
	}
}
