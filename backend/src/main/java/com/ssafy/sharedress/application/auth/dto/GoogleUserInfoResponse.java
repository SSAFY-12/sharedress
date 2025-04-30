package com.ssafy.sharedress.application.auth.dto;

public record GoogleUserInfoResponse(
	String id,
	String email,
	String name,
	String picture
) {
}
