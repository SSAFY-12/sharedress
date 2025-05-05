package com.ssafy.sharedress.application.member.dto;

import com.ssafy.sharedress.domain.member.entity.Member;

public record MemberProfileResponse(
	Long id,
	String email,
	String nickname,
	String code,
	String profileImage,
	String oneLiner
) {
	public static MemberProfileResponse from(Member member) {
		return new MemberProfileResponse(
			member.getId(),
			member.getEmail(),
			member.getNickname(),
			member.getCode(),
			member.getProfileUrl(),
			member.getStatusMessage()
		);
	}
}
