package com.ssafy.sharedress.domain.closet.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClosetClothesRepository {
	CursorPageResult<ClosetClothes> findByMemberAndCategoryWithCursor(
		Long memberId,
		Long categoryId,
		Long cursorId,
		int size
	);

	ClosetClothes save(ClosetClothes closetClothes);

	ClosetClothes getReferenceById(Long id);

	Optional<ClosetClothes> findById(Long id);
}
