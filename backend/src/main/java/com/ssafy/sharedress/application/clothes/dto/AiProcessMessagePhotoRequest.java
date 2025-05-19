package com.ssafy.sharedress.application.clothes.dto;

import java.util.List;

public record AiProcessMessagePhotoRequest(
	String taskId,
	Long memberId,
	List<ItemInfo> items
) {
	public record ItemInfo(
		Long closetClothesId,
		String s3Url,
		Long categoryId
	) {
	}
}
