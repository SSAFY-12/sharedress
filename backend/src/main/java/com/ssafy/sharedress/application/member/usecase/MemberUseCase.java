package com.ssafy.sharedress.application.member.usecase;

import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.application.member.dto.MyProfileResponse;
import com.ssafy.sharedress.application.member.dto.UpdateProfileRequest;

public interface MemberUseCase {
	MyProfileResponse getMyProfile(Long memberId);

	MemberProfileResponse getMemberProfile(Long memberId);

	MyProfileResponse updateProfile(UpdateProfileRequest request, Long myId);
}
