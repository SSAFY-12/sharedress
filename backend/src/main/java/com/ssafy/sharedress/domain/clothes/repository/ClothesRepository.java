package com.ssafy.sharedress.domain.clothes.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClothesRepository {
	Clothes save(Clothes clothes);

	Optional<Clothes> findByNameAndBrandId(String name, Long brandId);

	CursorPageResult<ClothesSearchResponse> searchClothesWithCursor(
		String keyword,
		Long categoryId,
		Long shopId,
		Long cursorId,
		int size
	);

	List<Clothes> findAllByIds(List<Long> ids);

	Optional<Clothes> findById(Long id);
}
