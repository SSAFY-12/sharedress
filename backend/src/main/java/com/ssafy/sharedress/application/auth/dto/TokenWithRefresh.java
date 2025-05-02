package com.ssafy.sharedress.application.auth.dto;

public record TokenWithRefresh(
	String refreshToken,
	String accessToken
) {
}
