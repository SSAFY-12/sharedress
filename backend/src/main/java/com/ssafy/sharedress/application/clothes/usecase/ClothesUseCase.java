package com.ssafy.sharedress.application.clothes.usecase;

import java.util.List;

import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClothesUseCase {

	CursorPageResult<ClothesSearchResponse> getLibraryClothes(
		String keyword,
		List<Long> categoryIds,
		Long shopId,
		Long cursor,
		int size
	);

	void markClothesAsAiCompleted(Long memberId, String fcmToken);

}
