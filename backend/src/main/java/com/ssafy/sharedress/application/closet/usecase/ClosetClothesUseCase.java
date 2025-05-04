package com.ssafy.sharedress.application.closet.usecase;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesUpdateRequest;

public interface ClosetClothesUseCase {
	ClosetClothesDetailResponse updateClosetClothes(Long memberId, Long closetClothesId,
		ClosetClothesUpdateRequest request);

	void removeClosetClothes(Long memberId, Long closetClothesId);
}
