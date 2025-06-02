package com.ssafy.sharedress.adapter.closet.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.entity.QClosetClothes;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.clothes.entity.QClothes;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClosetClothesPersistenceAdapter implements ClosetClothesRepository {

	private final JPAQueryFactory queryFactory;

	private final ClosetClothesJpaRepository closetClothesJpaRepository;

	@Override
	public CursorPageResult<ClosetClothes> findByMemberAndCategoryWithCursor(
		Long memberId,
		Long categoryId,
		Long cursorId,
		int size,
		boolean isMe
	) {
		QClosetClothes cc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		BooleanBuilder condition = new BooleanBuilder()
			.and(cc.closet.member.id.eq(memberId))
			.and(cc.imageUrl.isNotNull());

		if (categoryId != null) {
			condition.and(
				cc.customCategory.id.eq(categoryId)
					.or(cc.customCategory.isNull().and(cl.category.id.eq(categoryId)))
			);
		}

		if (cursorId != null) {
			condition.and(cc.id.lt(cursorId));
		}

		if (!isMe) {
			condition.and(cc.isPublic.isTrue());
		}

		List<ClosetClothes> results = queryFactory.selectFrom(cc)
			.leftJoin(cc.clothes, cl).fetchJoin()
			.leftJoin(cc.customBrand).fetchJoin()
			.leftJoin(cl.color).fetchJoin()
			.leftJoin(cl.brand).fetchJoin()
			.leftJoin(cl.category).fetchJoin()
			.where(condition)
			.orderBy(cc.id.desc())
			.limit(size + 1)
			.fetch();

		boolean hasNext = results.size() > size;
		if (hasNext) {
			results.remove(size);
		}

		Long nextCursor = hasNext ? results.get(results.size() - 1).getId() : null;

		return new CursorPageResult<>(results, hasNext, nextCursor);
	}

	@Override
	public ClosetClothes save(ClosetClothes closetClothes) {
		return closetClothesJpaRepository.save(closetClothes);
	}

	@Override
	public ClosetClothes getReferenceById(Long id) {
		return closetClothesJpaRepository.getReferenceById(id);
	}

	@Override
	public Optional<ClosetClothes> findByIdAndImgNotNull(Long id) {
		QClosetClothes cc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		BooleanBuilder condition = new BooleanBuilder()
			.and(cc.id.eq(id))
			.and(cc.imageUrl.isNotNull());

		return Optional.ofNullable(
			queryFactory.selectFrom(cc)
				.leftJoin(cc.clothes, cl).fetchJoin()
				.leftJoin(cc.customBrand).fetchJoin()
				.leftJoin(cl.color).fetchJoin()
				.leftJoin(cl.brand).fetchJoin()
				.leftJoin(cl.category).fetchJoin()
				.leftJoin(cl.shoppingMall).fetchJoin()
				.where(condition)
				.fetchOne()
		);
	}

	@Override
	public Optional<ClosetClothes> findById(Long id) {
		QClosetClothes cc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		BooleanBuilder condition = new BooleanBuilder()
			.and(cc.id.eq(id));

		return Optional.ofNullable(
			queryFactory.selectFrom(cc)
				.leftJoin(cc.clothes, cl).fetchJoin()
				.where(condition)
				.fetchOne()
		);
	}

	@Override
	public boolean existsByClosetIdAndClothesId(Long closetId, Long clothesId) {
		return closetClothesJpaRepository.existsByClosetIdAndClothesId(closetId, clothesId);
	}

	@Override
	public void deleteById(Long closetClothesId) {
		closetClothesJpaRepository.deleteById(closetClothesId);
	}

	@Override
	public Boolean existsByIdAndMemberId(Long closetClothesId, Long memberId) {
		return closetClothesJpaRepository.existsByIdAndMemberId(closetClothesId, memberId);
	}

	@Override
	public List<ClosetClothes> findAllByClothesIds(List<Long> clothesIds) {
		QClosetClothes cc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		BooleanBuilder condition = new BooleanBuilder()
			.and(cc.clothes.id.in(clothesIds));

		return queryFactory
			.selectFrom(cc)
			.leftJoin(cc.clothes, cl).fetchJoin()
			.where(condition)
			.fetch();
	}

	@Override
	public List<ClosetClothes> findAllByMemberId(Long myId) {
		return closetClothesJpaRepository.findAllByMemberId(myId);
	}

	@Override
	public List<ClosetClothes> findAllByIds(List<Long> closetClothesIds) {
		QClosetClothes cc = QClosetClothes.closetClothes;
		QClothes cl = QClothes.clothes;

		BooleanBuilder condition = new BooleanBuilder()
			.and(cc.id.in(closetClothesIds));

		return queryFactory
			.selectFrom(cc)
			.leftJoin(cc.clothes, cl).fetchJoin()
			.where(condition)
			.fetch();
	}

	@Override
	public void deleteAllByCloset_Id(Long closetId) {
		closetClothesJpaRepository.deleteAllByCloset_Id(closetId);
	}

	@Override
	public void delete(ClosetClothes closetClothes) {
		closetClothesJpaRepository.delete(closetClothes);
	}

	@Override
	public Optional<ClosetClothes> findByClosetIdAndClothesId(Long closetId, Long clothesId) {
		return closetClothesJpaRepository.findByClosetIdAndClothesId(closetId, clothesId);
	}
}
