package com.ssafy.sharedress.application.member.usecase;

import com.ssafy.sharedress.application.member.dto.MyProfileResponse;

public interface MemberUseCase {
	MyProfileResponse getMyProfile(Long memberId);
}
