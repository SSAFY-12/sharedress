package com.ssafy.sharedress.adapter.brand.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.sharedress.application.brand.dto.BrandSearchResponse;
import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.entity.QBrand;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BrandPersistenceAdapter implements BrandRepository {

	private final BrandJpaRepository brandJpaRepository;
	private final JPAQueryFactory queryFactory;

	@Override
	public List<Brand> findAll() {
		return brandJpaRepository.findAll();
	}

	@Override
	public List<Brand> findByNameContaining(String keyword) {
		return brandJpaRepository.searchByKeyword(keyword);
	}

	@Override
	public Optional<Brand> findByExactNameEnOrKr(String nameEn, String nameKr) {
		return brandJpaRepository.findByExactNameEnOrKr(nameEn, nameKr);
	}

	@Override
	public Brand save(Brand brand) {
		return brandJpaRepository.save(brand);
	}

	@Override
	public Optional<Brand> findById(Long id) {
		return brandJpaRepository.findById(id);
	}

	@Override
	public Brand getReferenceById(Long id) {
		return brandJpaRepository.getReferenceById(id);
	}

	@Override
	public CursorPageResult<BrandSearchResponse> searchBrandsWithCursor(String keyword, Long cursorId, int size) {
		QBrand brand = QBrand.brand;

		BooleanBuilder condition = new BooleanBuilder();

		// 키워드 필터 (한글 or 영문 이름)
		if (keyword != null && !keyword.isBlank()) {
			condition.andAnyOf(
				brand.nameKr.containsIgnoreCase(keyword),
				brand.nameEn.containsIgnoreCase(keyword)
			);
		}

		// 커서 페이징 처리 (id 기준 오름차순)
		if (cursorId != null) {
			condition.and(brand.id.gt(cursorId));
		}

		List<BrandSearchResponse> fetched = queryFactory
			.select(Projections.constructor(BrandSearchResponse.class,
				brand.id,
				brand.nameKr,
				brand.nameEn
			))
			.from(brand)
			.where(condition)
			.orderBy(brand.id.asc())  // 오름차순 정렬
			.limit(size + 1)
			.fetch();

		boolean hasNext = fetched.size() > size;
		List<BrandSearchResponse> content = hasNext ? fetched.subList(0, size) : fetched;
		Long nextCursor = hasNext ? content.get(content.size() - 1).id() : null;

		return new CursorPageResult<>(content, hasNext, nextCursor);
	}

}
