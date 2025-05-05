package com.ssafy.sharedress.application.clothes.dto;

public record AiCompleteRequest(
	Long memberId,
	String fcmToken
) {
}
