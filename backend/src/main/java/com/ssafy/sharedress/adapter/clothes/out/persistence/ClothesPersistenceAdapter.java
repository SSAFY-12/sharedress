package com.ssafy.sharedress.adapter.clothes.out.persistence;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
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

		if (keyword != null && !keyword.isBlank()) {
			String[] tokens = keyword.trim().split("\\s+");
			BooleanBuilder keywordCondition = new BooleanBuilder();

			// 브랜드-상품 조합 조건
			for (int i = 0; i < tokens.length; i++) {
				String brandToken = tokens[i];
				List<String> productTokens = new ArrayList<>();

				for (int j = 0; j < tokens.length; j++) {
					if (j != i) {
						productTokens.add(tokens[j]);
					}
				}

				BooleanBuilder candidate = new BooleanBuilder();

				// 브랜드 조건
				candidate.andAnyOf(
					brand.nameKr.containsIgnoreCase(brandToken),
					brand.nameEn.containsIgnoreCase(brandToken)
				);

				// 상품명 조건
				for (String productToken : productTokens) {
					candidate.and(clothes.name.containsIgnoreCase(productToken));
				}

				keywordCondition.or(candidate);
			}

			BooleanBuilder nameOnly = new BooleanBuilder();
			for (String token : tokens) {
				nameOnly.and(clothes.name.containsIgnoreCase(token));
			}
			keywordCondition.or(nameOnly);

			condition.and(keywordCondition);
		}

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
