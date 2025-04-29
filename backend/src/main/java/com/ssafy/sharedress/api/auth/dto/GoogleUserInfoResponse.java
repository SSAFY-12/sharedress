package com.ssafy.sharedress.api.auth.dto;

public record GoogleUserInfoResponse(
	String id,
	String email,
	String name,
	String picture
) {
}
