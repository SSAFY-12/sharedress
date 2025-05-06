package com.ssafy.sharedress.adapter.coordination.out.persistence;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.coordination.entity.CoordinationComment;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationCommentRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CoordinationCommentPersistenceAdapter implements CoordinationCommentRepository {

	private final CoordinationCommentJpaRepository coordinationCommentJpaRepository;

	@Override
	public CoordinationComment save(CoordinationComment comment) {
		return coordinationCommentJpaRepository.save(comment);
	}

	@Override
	public Optional<CoordinationComment> findById(Long id) {
		return coordinationCommentJpaRepository.findById(id);
	}

	@Override
	public void delete(CoordinationComment comment) {
		coordinationCommentJpaRepository.delete(comment);
	}
}
