package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record AiProcessMessageRequest(
	String taskId,
	Boolean isLast,
	Long memberId,
	String fcmToken,
	List<ItemInfo> items
) {
	public record ItemInfo(
		Long clothesId,
		String linkUrl
	) {
	}
}
