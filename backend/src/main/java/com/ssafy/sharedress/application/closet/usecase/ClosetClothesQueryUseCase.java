package com.ssafy.sharedress.application.closet.usecase;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesResponse;
import com.ssafy.sharedress.domain.common.context.UserContext;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClosetClothesQueryUseCase {
	CursorPageResult<ClosetClothesResponse> getMemberClosetClothes(
		UserContext userContext,
		Long targetMemberId,
		Long categoryId,
		Long cursor,
		int size
	);

	ClosetClothesDetailResponse getClosetClothesDetail(Long memberId, Long closetClothesId);
}
