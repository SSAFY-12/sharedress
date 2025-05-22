package com.ssafy.sharedress.application.coordination.usecase;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestRequest;

public interface CoordinationRequestUseCase {
	void sendCoordinationRequest(Long myId, CoordinationRequestRequest request);
}
