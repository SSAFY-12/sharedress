package com.ssafy.sharedress.application.closet.usecase;

import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesUpdateRequest;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;

public interface ClosetClothesUseCase {
	ClosetClothesDetailResponse updateClosetClothes(
		Long memberId,
		Long closetClothesId,
		ClosetClothesUpdateRequest request
	);

	void removeClosetClothes(Long memberId, Long closetClothesId);

	Long addLibraryClothesToCloset(Long clothesId, Long memberId);

	AiTaskResponse registerClothesFromPurchase(PurchaseHistoryRequest request, Long memberId);
}
