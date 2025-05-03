package com.ssafy.sharedress.domain.coordination.repository;

import java.util.List;

import com.ssafy.sharedress.domain.coordination.entity.Coordination;

public interface CoordinationRepository {
	Coordination save(Coordination coordination);

	List<Coordination> findMyCoordinations(Long myId);

	List<Coordination> findMyRecommendedCoordinations(Long myId);
}
