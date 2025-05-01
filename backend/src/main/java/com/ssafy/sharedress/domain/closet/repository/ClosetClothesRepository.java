package com.ssafy.sharedress.domain.closet.repository;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClosetClothesRepository {
	CursorPageResult<ClosetClothes> findByMemberAndCategoryWithCursor(
		Long memberId,
		Long categoryId,
		Long cursorId,
		int size
	);
}
