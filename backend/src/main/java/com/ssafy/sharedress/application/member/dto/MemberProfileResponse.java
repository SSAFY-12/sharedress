package com.ssafy.sharedress.application.member.dto;

import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;

public record MemberProfileResponse(
	Long id,
	String email,
	String nickname,
	String code,
	String profileImage,
	String oneLiner,
	Boolean isGuest
) {
	public static MemberProfileResponse from(Member member) {
		return new MemberProfileResponse(
			member.getId(),
			member.getEmail(),
			member.getNickname(),
			member.getCode(),
			member.getProfileUrl(),
			member.getStatusMessage(),
			false
		);
	}

	public static MemberProfileResponse from(Guest guest) {
		return new MemberProfileResponse(
			guest.getId(),
			null,
			guest.getNickname(),
			guest.getCode(),
			null,
			null,
			true
		);
	}
}
