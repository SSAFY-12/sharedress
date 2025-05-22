package com.ssafy.sharedress.application.member.usecase;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.member.dto.FcmTokenRequest;
import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.application.member.dto.MyProfileResponse;
import com.ssafy.sharedress.application.member.dto.PrivacyAgreeRequest;
import com.ssafy.sharedress.application.member.dto.PrivacyAgreeResponse;
import com.ssafy.sharedress.application.member.dto.UpdateNotificationStatusRequest;
import com.ssafy.sharedress.application.member.dto.UpdateProfileImageResponse;
import com.ssafy.sharedress.application.member.dto.UpdateProfileRequest;

public interface MemberUseCase {
	MyProfileResponse getMyProfile(Long memberId);

	MemberProfileResponse getMemberProfile(Long memberId);

	MyProfileResponse updateProfile(UpdateProfileRequest request, Long myId);

	void updateNotificationStatus(UpdateNotificationStatusRequest request, Long myId);

	UpdateProfileImageResponse updateProfileImage(MultipartFile profileImage, Long memberId);

	void saveFcmToken(FcmTokenRequest request, Long memberId);

	PrivacyAgreeResponse getPrivacyAgreement(Long memberId);

	PrivacyAgreeResponse updatePrivacyAgreement(Long memberId, PrivacyAgreeRequest request);
}
