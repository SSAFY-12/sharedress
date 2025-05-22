package com.ssafy.sharedress.adapter.coordination.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.coordination.entity.CoordinationComment;

public interface CoordinationCommentJpaRepository extends JpaRepository<CoordinationComment, Long> {
}
