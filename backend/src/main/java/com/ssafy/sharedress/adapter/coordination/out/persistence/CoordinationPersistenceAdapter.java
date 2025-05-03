package com.ssafy.sharedress.adapter.coordination.out.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.sharedress.domain.closet.entity.QClosetClothes;
import com.ssafy.sharedress.domain.clothes.entity.QClothes;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.entity.QCoordination;
import com.ssafy.sharedress.domain.coordination.entity.QCoordinationClothes;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CoordinationPersistenceAdapter implements CoordinationRepository {

	private final JPAQueryFactory queryFactory;
	private final CoordinationJpaRepository coordinationJpaRepository;

	@Override
	public Coordination save(Coordination coordination) {
		return coordinationJpaRepository.save(coordination);
	}

	@Override
	public List<Coordination> findMyCoordinations(Long myId) {
		QCoordination cd = QCoordination.coordination;
		QCoordinationClothes cc = QCoordinationClothes.coordinationClothes;
		QClosetClothes clc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		return queryFactory
			.selectFrom(cd)
			.leftJoin(cd.coordinationClothes, cc).fetchJoin()
			.leftJoin(cc.closetClothes, clc).fetchJoin()
			.leftJoin(clc.clothes, cl).fetchJoin()
			.where(
				cd.creator.id.eq(myId)
					.and(cd.owner.id.eq(myId))
			)
			.orderBy(cd.id.desc())
			.distinct()
			.fetch();
	}

	@Override
	public List<Coordination> findMyRecommendedCoordinations(Long myId) {
		QCoordination cd = QCoordination.coordination;
		QCoordinationClothes cc = QCoordinationClothes.coordinationClothes;
		QClosetClothes clc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		return queryFactory
			.selectFrom(cd)
			.leftJoin(cd.coordinationClothes, cc).fetchJoin()
			.leftJoin(cc.closetClothes, clc).fetchJoin()
			.leftJoin(clc.clothes, cl).fetchJoin()
			.where(
				cd.owner.id.eq(myId)
					.and(cd.originCreator.id.ne(myId))
			)
			.orderBy(cd.id.desc())
			.distinct()
			.fetch();
	}

	@Override
	public List<Coordination> findFriendCoordinations(Long friendId) {
		QCoordination cd = QCoordination.coordination;
		QCoordinationClothes cc = QCoordinationClothes.coordinationClothes;
		QClosetClothes clc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		return queryFactory
			.selectFrom(cd)
			.leftJoin(cd.coordinationClothes, cc).fetchJoin()
			.leftJoin(cc.closetClothes, clc).fetchJoin()
			.leftJoin(clc.clothes, cl).fetchJoin()
			.where(
				cd.creator.id.eq(friendId)
					.and(cd.owner.id.eq(friendId))
			)
			.orderBy(cd.id.desc())
			.distinct()
			.fetch();
	}

	@Override
	public List<Coordination> findMyRecommendToFriend(Long myId, Long friendId) {
		QCoordination cd = QCoordination.coordination;
		QCoordinationClothes cc = QCoordinationClothes.coordinationClothes;
		QClosetClothes clc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		return queryFactory
			.selectFrom(cd)
			.leftJoin(cd.coordinationClothes, cc).fetchJoin()
			.leftJoin(cc.closetClothes, clc).fetchJoin()
			.leftJoin(clc.clothes, cl).fetchJoin()
			.where(
				cd.originCreator.id.eq(myId)
					.and(cd.owner.id.eq(friendId))
			)
			.orderBy(cd.id.desc())
			.distinct()
			.fetch();
	}

}
