package com.ssafy.sharedress.application.member.dto;

public record DecodingOpenLinkResponse(
	Long memberId,
	Boolean isPublic
) {
}
