package com.ssafy.sharedress.application.coordination.usecase;

import com.ssafy.sharedress.application.coordination.dto.CoordinationCommentResponse;
import com.ssafy.sharedress.application.coordination.dto.CreateCommentRequest;

public interface CoordinationCommentUseCase {

	CoordinationCommentResponse create(Long coordinationId, CreateCommentRequest request, Long memberId);
}
