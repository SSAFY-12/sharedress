package com.ssafy.sharedress.domain.coordination.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.coordination.entity.CoordinationComment;

public interface CoordinationCommentRepository {
	CoordinationComment save(CoordinationComment comment);

	Optional<CoordinationComment> findById(Long id);

	void delete(CoordinationComment comment);
}
