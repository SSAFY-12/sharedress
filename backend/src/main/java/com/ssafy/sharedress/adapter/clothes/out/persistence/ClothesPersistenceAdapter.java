package com.ssafy.sharedress.adapter.clothes.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.domain.brand.entity.QBrand;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.clothes.entity.QClothes;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
import com.ssafy.sharedress.domain.shoppingmall.entity.QShoppingMall;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ClothesPersistenceAdapter implements ClothesRepository {

	private final JPAQueryFactory queryFactory;

	private final ClothesJpaRepository clothesJpaRepository;

	@Override
	public Clothes save(Clothes clothes) {
		return clothesJpaRepository.save(clothes);
	}

	@Override
	public Optional<Clothes> findByNameAndBrandId(String name, Long brandId) {
		return clothesJpaRepository.findByNameAndBrandId(name, brandId);
	}

	@Override
	public CursorPageResult<ClothesSearchResponse> searchClothesWithCursor(
		String keyword,
		Long categoryId,
		Long shopId,
		Long cursorId,
		int size
	) {
		QClothes clothes = QClothes.clothes;
		QBrand brand = QBrand.brand;
		QShoppingMall shop = QShoppingMall.shoppingMall;

		BooleanBuilder condition = new BooleanBuilder();

		// 카테고리 필터
		if (categoryId != null) {
			condition.and(clothes.category.id.eq(categoryId));
		}

		// 쇼핑몰 필터
		if (shopId != null) {
			condition.and(clothes.shoppingMall.id.eq(shopId));
		}

		// 커서 페이징
		if (cursorId != null) {
			condition.and(clothes.id.lt(cursorId));
		}

		// 키워드 필터 (상품명 or 브랜드명)
		if (keyword != null && !keyword.isBlank()) {
			condition.andAnyOf(
				clothes.name.containsIgnoreCase(keyword),
				brand.nameEn.containsIgnoreCase(keyword),
				brand.nameKr.containsIgnoreCase(keyword)
			);
		}

		List<ClothesSearchResponse> fetched = queryFactory
			.select(Projections.constructor(ClothesSearchResponse.class,
				clothes.id,
				clothes.name,
				brand.nameKr,
				clothes.imageUrl,
				clothes.createdAt
			))
			.from(clothes)
			.leftJoin(clothes.brand, brand)
			.leftJoin(clothes.shoppingMall, shop)
			.where(condition)
			.orderBy(clothes.id.desc())
			.limit(size + 1)
			.fetch();

		boolean hasNext = fetched.size() > size;
		List<ClothesSearchResponse> content = hasNext ? fetched.subList(0, size) : fetched;
		Long nextCursor = hasNext ? content.get(content.size() - 1).id() : null;

		return new CursorPageResult<>(content, hasNext, nextCursor);
	}

	@Override
	public List<Clothes> findAllByIds(List<Long> ids) {
		return clothesJpaRepository.findAllById(ids);
	}
}
