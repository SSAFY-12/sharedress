package com.ssafy.sharedress.application.clothes.dto;

public record AiProcessMessageRequest(
	Long clothesId,
	Long memberId,
	String linkUrl,
	String fcmToken
) {
}
