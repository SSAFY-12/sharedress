package com.ssafy.sharedress.application.coordination.usecase;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequest;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;

public interface CoordinationUseCase {
	CoordinationResponse saveMyCoordination(Long myId, CoordinationRequest coordinationRequest);
	
	CoordinationResponse recommendCoordination(Long myId, Long targetMemberId, CoordinationRequest coordinationRequest);
}
