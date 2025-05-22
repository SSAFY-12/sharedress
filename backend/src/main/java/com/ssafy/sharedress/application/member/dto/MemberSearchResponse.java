package com.ssafy.sharedress.application.member.dto;

public record MemberSearchResponse(
	Long memberId,
	String profileImage,
	String nickname,
	String code,
	Integer relationStatus
) {
}
