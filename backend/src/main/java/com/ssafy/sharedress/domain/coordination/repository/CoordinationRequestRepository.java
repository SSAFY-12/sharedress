package com.ssafy.sharedress.domain.coordination.repository;

import com.ssafy.sharedress.domain.coordination.entity.CoordinationRequest;

public interface CoordinationRequestRepository {
	void save(CoordinationRequest coordinationRequest);
}
