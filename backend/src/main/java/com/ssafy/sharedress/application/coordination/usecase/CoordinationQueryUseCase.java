package com.ssafy.sharedress.application.coordination.usecase;

import java.util.List;

import com.ssafy.sharedress.application.coordination.dto.CoordinationDetailResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;
import com.ssafy.sharedress.application.coordination.dto.CoordinationWithItemResponse;
import com.ssafy.sharedress.application.coordination.dto.Scope;
import com.ssafy.sharedress.domain.common.context.UserContext;

public interface CoordinationQueryUseCase {

	List<CoordinationWithItemResponse> getCoordinations(UserContext userContext, Long targetMemberId, Scope scope);

	CoordinationDetailResponse getCoordinationDetail(Long myId, Long coordinationId);

	List<CoordinationResponse> getFriendCoordinations(Long myId, Long friendId);
}
