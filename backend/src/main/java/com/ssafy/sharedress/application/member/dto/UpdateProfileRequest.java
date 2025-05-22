package com.ssafy.sharedress.application.member.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
	@NotBlank(message = "닉네임은 필수입니다.")
	String nickname,
	String oneLiner,
	Boolean isPublic
) {
}
