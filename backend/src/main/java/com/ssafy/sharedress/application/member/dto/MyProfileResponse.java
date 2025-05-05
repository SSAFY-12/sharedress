package com.ssafy.sharedress.application.member.dto;

import com.ssafy.sharedress.domain.member.entity.Member;

public record MyProfileResponse(
	Long id,
	String email,
	String nickname,
	String code,
	String profileImage,
	String oneLiner,
	Boolean isPublic,
	Boolean notificationStatus
) {
	public static MyProfileResponse from(Member member) {
		return new MyProfileResponse(
			member.getId(),
			member.getEmail(),
			member.getNickname(),
			member.getCode(),
			member.getProfileUrl(),
			member.getStatusMessage(),
			member.getIsPublic(),
			member.getNotificationStatus()
		);
	}
}
