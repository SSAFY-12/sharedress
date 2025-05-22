package com.ssafy.sharedress.adapter.coordination.out.persistence;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.coordination.entity.CoordinationRequest;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRequestRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CoordinationRequestPersistenceAdapter implements CoordinationRequestRepository {

	private final CoordinationRequestJpaRepository coordinationRequestJpaRepository;

	@Override
	public void save(CoordinationRequest coordinationRequest) {
		coordinationRequestJpaRepository.save(coordinationRequest);
	}
}
