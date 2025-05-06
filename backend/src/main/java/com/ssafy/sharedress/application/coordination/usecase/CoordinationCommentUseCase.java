package com.ssafy.sharedress.application.coordination.usecase;

import com.ssafy.sharedress.application.coordination.dto.CoordinationCommentResponse;
import com.ssafy.sharedress.application.coordination.dto.CreateCommentRequest;
import com.ssafy.sharedress.application.coordination.dto.UpdateCommentRequest;

public interface CoordinationCommentUseCase {

	CoordinationCommentResponse create(Long coordinationId, CreateCommentRequest request, Long memberId);

	CoordinationCommentResponse update(Long coordinationId, Long commentId, UpdateCommentRequest request,
		Long memberId);

	void removeComment(Long coordinationId, Long commentId, Long memberId);
}
