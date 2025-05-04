package com.ssafy.sharedress.application.member.usecase;

import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface MemberQueryUseCase {
	CursorPageResult<MemberSearchResponse> getMemberListByKeyword(
		Long memberId,
		String keyword,
		Long cursor,
		int size
	);
}
