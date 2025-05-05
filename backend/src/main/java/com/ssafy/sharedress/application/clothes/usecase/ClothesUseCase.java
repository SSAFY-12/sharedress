package com.ssafy.sharedress.application.clothes.usecase;

import java.util.List;

import com.ssafy.sharedress.application.clothes.dto.ClothesSearchResponse;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClothesUseCase {
	// 1. 구매 내역 기반 옷 등록
	void registerClothesFromPurchase(PurchaseHistoryRequest request, Long memberId);

	// 라이브러리 옷 조회(검색)
	CursorPageResult<ClothesSearchResponse> getLibraryClothes(
		String keyword,
		List<Long> categoryIds,
		Long shopId,
		Long cursor,
		int size
	);

	void markClothesAsAiCompleted(Long memberId, String fcmToken);

}
