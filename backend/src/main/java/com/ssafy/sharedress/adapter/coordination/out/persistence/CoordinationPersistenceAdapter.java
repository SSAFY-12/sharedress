package com.ssafy.sharedress.adapter.coordination.out.persistence;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CoordinationPersistenceAdapter implements CoordinationRepository {

	private final CoordinationJpaRepository coordinationJpaRepository;

	@Override
	public Coordination save(Coordination coordination) {
		return coordinationJpaRepository.save(coordination);
	}
}
