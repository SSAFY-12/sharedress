package com.ssafy.sharedress.adapter.clothes.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.domain.brand.entity.QBrand;
import com.ssafy.sharedress.domain.category.entity.QCategory;
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
		QCategory category = QCategory.category;

		BooleanBuilder condition = new BooleanBuilder();

		condition.and(clothes.imageUrl.isNotNull());

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

		condition.and(searchByKeyword(keyword, brand, clothes));

		List<ClothesSearchResponse> fetched = queryFactory
			.select(Projections.constructor(ClothesSearchResponse.class,
				clothes.id,
				clothes.name,
				brand.nameKr,
				clothes.imageUrl,
				clothes.createdAt,
				clothes.category.id
			))
			.from(clothes)
			.leftJoin(clothes.brand, brand)
			.leftJoin(clothes.shoppingMall, shop)
			.leftJoin(clothes.category, category)
			.where(condition)
			.orderBy(clothes.id.desc())
			.limit(size + 1)
			.fetch();

		boolean hasNext = fetched.size() > size;
		List<ClothesSearchResponse> content = hasNext ? fetched.subList(0, size) : fetched;
		Long nextCursor = hasNext ? content.get(content.size() - 1).id() : null;

		return new CursorPageResult<>(content, hasNext, nextCursor);
	}

	public BooleanExpression searchByKeyword(String keyword, QBrand brand, QClothes product) {
		if (keyword == null || keyword.trim().isEmpty()) {
			return null;
		}

		String[] tokens = keyword.trim().split("\\s+"); // 공백 기준 분리
		String keywordNoSpace = keyword.replaceAll("\\s+", ""); // 전체 공백 제거

		// 1. 각 토큰이 브랜드명 또는 상품명에 포함되는지 검사 (AND 조건)
		BooleanExpression tokenMatch = null;
		for (String token : tokens) {
			BooleanExpression singleTokenMatch =
				Expressions.stringTemplate("replace({0}, ' ', '')", brand.nameKr).containsIgnoreCase(token)
					.or(Expressions.stringTemplate("replace({0}, ' ', '')", brand.nameEn).containsIgnoreCase(token))
					.or(Expressions.stringTemplate("replace({0}, ' ', '')", product.name).containsIgnoreCase(token));

			tokenMatch = (tokenMatch == null) ? singleTokenMatch : tokenMatch.and(singleTokenMatch);
		}

		// 2. 공백 제거된 전체 문자열로 브랜드+상품을 concat한 문자열에서 검색 (OR 조건)
		BooleanExpression concatMatchKr = Expressions.stringTemplate(
			"replace(concat({0}, {1}), ' ', '')",
			brand.nameKr, product.name
		).containsIgnoreCase(keywordNoSpace);

		BooleanExpression concatMatchEn = Expressions.stringTemplate(
			"replace(concat({0}, {1}), ' ', '')",
			brand.nameEn, product.name
		).containsIgnoreCase(keywordNoSpace);

		// 최종 조건: 둘 중 하나라도 만족하면 됨
		return tokenMatch.or(concatMatchKr).or(concatMatchEn);
	}

	@Override
	public List<Clothes> findAllByIds(List<Long> ids) {
		return clothesJpaRepository.findAllById(ids);
	}

	@Override
	public Optional<Clothes> findById(Long id) {
		return clothesJpaRepository.findById(id);
	}

	@Override
	public void deleteById(Long id) {
		clothesJpaRepository.deleteById(id);
	}
}
