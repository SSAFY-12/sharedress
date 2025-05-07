package com.ssafy.sharedress.adapter.coordination.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.coordination.dto.CoordinationCommentResponse;
import com.ssafy.sharedress.application.coordination.dto.CreateCommentRequest;
import com.ssafy.sharedress.application.coordination.dto.UpdateCommentRequest;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationCommentQueryUseCase;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationCommentUseCase;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CoordinationCommentController {

	private final CoordinationCommentQueryUseCase commentQueryUseCase;
	private final CoordinationCommentUseCase commentUseCase;

	@PostMapping("/coordinations/{coordinationId}/comments")
	public ResponseEntity<ResponseWrapper<CoordinationCommentResponse>> createComment(
		@PathVariable Long coordinationId,
		@RequestBody CreateCommentRequest request
	) {
		Long memberId = 1L; // TODO[지윤]: @CurrentMember로 변경하기
		CoordinationCommentResponse result = commentUseCase.createComment(coordinationId, request, memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.CREATED, result);
	}

	@PatchMapping("/coordinations/{coordinationId}/comments/{commentId}")
	public ResponseEntity<ResponseWrapper<CoordinationCommentResponse>> updateComment(
		@PathVariable Long coordinationId,
		@PathVariable Long commentId,
		@RequestBody UpdateCommentRequest request
	) {
		Long memberId = 1L; // TODO[지윤]: @CurrentMember로 변경하기
		CoordinationCommentResponse result = commentUseCase.updateComment(coordinationId, commentId, request, memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@DeleteMapping("/coordinations/{coordinationId}/comments/{commentId}")
	public ResponseEntity<ResponseWrapper<Void>> deleteComment(
		@PathVariable Long coordinationId,
		@PathVariable Long commentId
	) {
		Long memberId = 1L; // TODO[지윤]: @CurrentMember로 변경하기
		commentUseCase.removeComment(coordinationId, commentId, memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	@GetMapping("/coordinations/{coordinationId}/comments")
	public ResponseEntity<ResponseWrapper<List<CoordinationCommentResponse>>> getComments(
		@PathVariable Long coordinationId
	) {
		Long memberId = 1L; // TODO[준]: @CurrentMember로 변경하기
		List<CoordinationCommentResponse> result = commentQueryUseCase.getCoordinationComments(
			coordinationId,
			memberId
		);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}
}
