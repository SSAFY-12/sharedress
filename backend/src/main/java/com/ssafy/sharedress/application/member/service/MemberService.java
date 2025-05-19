package com.ssafy.sharedress.application.member.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.member.dto.FcmTokenRequest;
import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.application.member.dto.MyProfileResponse;
import com.ssafy.sharedress.application.member.dto.PrivacyAgreeRequest;
import com.ssafy.sharedress.application.member.dto.PrivacyAgreeResponse;
import com.ssafy.sharedress.application.member.dto.UpdateNotificationStatusRequest;
import com.ssafy.sharedress.application.member.dto.UpdateProfileImageResponse;
import com.ssafy.sharedress.application.member.dto.UpdateProfileRequest;
import com.ssafy.sharedress.application.member.usecase.MemberUseCase;
import com.ssafy.sharedress.domain.common.port.ImageStoragePort;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService implements MemberUseCase {

	@Value("${cloud.aws.s3.path.profile}")
	private String profilePath;

	private final MemberRepository memberRepository;
	private final ImageStoragePort imageStoragePort;

	@Override
	public MyProfileResponse getMyProfile(Long memberId) {
		return memberRepository.findById(memberId)
			.map(MyProfileResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));
	}

	@Override
	public MemberProfileResponse getMemberProfile(Long memberId) {
		return memberRepository.findById(memberId)
			.map(MemberProfileResponse::from)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));
	}

	@Override
	@Transactional
	public MyProfileResponse updateProfile(UpdateProfileRequest request, Long myId) {
		Member member = memberRepository.findById(myId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		if (request.nickname() != null) {
			member.updateNickname(request.nickname());
		}
		if (request.oneLiner() != null) {
			member.updateStatusMessage(request.oneLiner());
		}
		if (request.isPublic() != null) {
			member.updateIsPublic(request.isPublic());
		}

		return MyProfileResponse.from(member);
	}

	@Override
	@Transactional
	public void updateNotificationStatus(UpdateNotificationStatusRequest request, Long myId) {
		Member member = memberRepository.findById(myId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		if (request.notificationStatus() != null) {
			member.updateNotificationStatus(request.notificationStatus());
		}
	}

	@Override
	@Transactional
	public UpdateProfileImageResponse updateProfileImage(MultipartFile profileImage, Long memberId) {
		if (profileImage == null || profileImage.isEmpty()) {
			ExceptionUtil.throwException(MemberErrorCode.INVALID_PROFILE_IMAGE);
		}

		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		String previousUrl = member.getProfileUrl();
		if (previousUrl != null && !previousUrl.isBlank()) {
			String previousKey = imageStoragePort.extractKeyFromUrl(previousUrl);
			imageStoragePort.delete(previousKey);
		}

		String imageUrl = imageStoragePort.upload(profilePath, profileImage);
		member.updateProfileImage(imageUrl);

		return new UpdateProfileImageResponse(imageUrl);
	}

	@Override
	@Transactional
	public void saveFcmToken(FcmTokenRequest request, Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		if (request.fcmToken() != null) {
			member.updateFcmToken(request.fcmToken());
		}
	}

	@Override
	public PrivacyAgreeResponse getPrivacyAgreement(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));
		return new PrivacyAgreeResponse(member.getIsPrivacyAgreement());
	}

	@Override
	public PrivacyAgreeResponse updatePrivacyAgreement(Long memberId, PrivacyAgreeRequest request) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		member.updatePrivacyAgreement(request.privacyAgreement());
		return new PrivacyAgreeResponse(member.getIsPrivacyAgreement());
	}
}
