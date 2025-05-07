package com.ssafy.sharedress.application.coordination.usecase;

import java.util.List;

import com.ssafy.sharedress.application.coordination.dto.CoordinationDetailResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationWithItemResponse;
import com.ssafy.sharedress.application.coordination.dto.Scope;

public interface CoordinationQueryUseCase {

	List<CoordinationWithItemResponse> getCoordinations(Long myId, Long targetMemberId, Scope scope);

	CoordinationDetailResponse getCoordinationDetail(Long myId, Long coordinationId);
}
