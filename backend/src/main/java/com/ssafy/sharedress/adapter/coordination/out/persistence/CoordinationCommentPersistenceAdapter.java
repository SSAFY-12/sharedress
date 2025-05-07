package com.ssafy.sharedress.adapter.coordination.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationComment;
import com.ssafy.sharedress.domain.coordination.entity.QCoordinationComment;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationCommentRepository;
import com.ssafy.sharedress.domain.member.entity.QMember;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CoordinationCommentPersistenceAdapter implements CoordinationCommentRepository {

	private final JPAQueryFactory queryFactory;
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

	@Override
	public List<CoordinationComment> findByCoordinationId(Long coordinationId) {
		QCoordinationComment cc = new QCoordinationComment("cc");
		QCoordinationComment pcc = new QCoordinationComment("pcc");
		QMember mem = QMember.member;

		BooleanBuilder condition = new BooleanBuilder()
			.and(cc.coordination.id.eq(coordinationId));

		return queryFactory.selectFrom(cc)
			.leftJoin(cc.member, mem).fetchJoin()
			.leftJoin(cc.parent, pcc).fetchJoin()
			.where(condition)
			.orderBy(cc.createdAt.desc())
			.fetch();
	}
}
