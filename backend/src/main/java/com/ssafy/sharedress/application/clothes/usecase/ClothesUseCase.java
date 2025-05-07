package com.ssafy.sharedress.application.clothes.usecase;

import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClothesUseCase {

	CursorPageResult<ClothesSearchResponse> getLibraryClothes(
		String keyword,
		Long categoryId,
		Long shopId,
		Long cursor,
		int size
	);

	void markClothesAsAiCompleted(Long memberId, String fcmToken);

}
