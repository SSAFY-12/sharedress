package com.ssafy.sharedress.application.coordination.usecase;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestDto;
import com.ssafy.sharedress.application.coordination.dto.CoordinationResponse;

public interface CoordinationUseCase {
	CoordinationResponse saveMyCoordination(Long myId, CoordinationRequestDto coordinationRequestDto);

	CoordinationResponse recommendCoordination(Long myId, Long targetMemberId,
		CoordinationRequestDto coordinationRequestDto);

	CoordinationResponse copyCoordination(Long myId, Long targetCoordinationId);
}
