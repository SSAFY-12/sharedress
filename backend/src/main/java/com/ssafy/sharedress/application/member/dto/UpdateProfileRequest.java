package com.ssafy.sharedress.application.member.dto;

public record UpdateProfileRequest(
	String nickname,
	String oneLiner,
	Boolean isPublic
) {
}
