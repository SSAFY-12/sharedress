package com.ssafy.sharedress.application.coordination.usecase;

import java.util.List;

import com.ssafy.sharedress.application.coordination.dto.CoordinationCommentResponse;

public interface CoordinationCommentQueryUseCase {
	List<CoordinationCommentResponse> getCoordinationComments(Long coordinationId, Long memberId);
}
